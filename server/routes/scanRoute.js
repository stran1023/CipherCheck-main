const express = require("express");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const multer = require("multer");
const { poolPromise } = require("../db/sqlClient");
require("dotenv").config();

const router = express.Router();
const VT_API_KEY = process.env.VT_API_KEY;

// ✅ Khởi tạo multer để lưu file tạm thời vào thư mục uploads/
const upload = multer({ dest: "uploads/" });

// ✅ Sử dụng middleware upload.single để xử lý file upload
router.post("/", upload.single("file"), async (req, res) => {
  const filePath = req.file?.path;
  const originalFileName = req.file?.originalname;
  const mimeType = req.file?.mimetype;
  const size = req.file?.size;
  const userId = req.body.userId;

  if (!req.file) {
    return res.status(400).json({ error: "Không nhận được file upload" });
  }

  if (!userId) {
    fs.unlink(filePath, () => {});
    return res.status(400).json({ error: "Thiếu userId" });
  }

  try {
    // Step 1: Upload file lên VirusTotal
    const form = new FormData();
    form.append("file", fs.createReadStream(filePath));

    const uploadRes = await axios.post(
      "https://www.virustotal.com/api/v3/files",
      form,
      {
        headers: {
          ...form.getHeaders(),
          "x-apikey": VT_API_KEY,
        },
      }
    );

    const analysisId = uploadRes.data.data.id;
    const analysisUrl = `https://www.virustotal.com/api/v3/analyses/${analysisId}`;

    let sha256 = null;
    let attempts = 0;

    while (attempts < 30) {
      const analysisRes = await axios.get(analysisUrl, {
        headers: { "x-apikey": VT_API_KEY },
      });

      if (analysisRes.data.data.attributes.status === "completed") {
        sha256 = analysisRes.data.meta.file_info.sha256;
        break;
      }

      await new Promise((r) => setTimeout(r, 4000));
      attempts++;
    }

    if (!sha256) {
      fs.unlink(filePath, () => {});
      return res
        .status(500)
        .json({ error: "Không thể lấy SHA256 sau khi phân tích" });
    }

    const fileInfoRes = await axios.get(
      `https://www.virustotal.com/api/v3/files/${sha256}`,
      {
        headers: { "x-apikey": VT_API_KEY },
      }
    );

    const fileData = fileInfoRes.data.data;
    const stats = fileData.attributes.last_analysis_stats;
    const analysisResults = fileData.attributes.last_analysis_results;

    const maliciousEngines = Object.entries(analysisResults)
      .filter(
        ([_, val]) =>
          val.category === "malicious" || val.category === "suspicious"
      )
      .map(([engine]) => engine);

    const isMalicious = maliciousEngines.length > 0;
    const engineCount = stats.malicious;
    const totalEngines =
      stats.harmless + stats.malicious + stats.undetected + stats.suspicious;

    // Step 2: Lưu vào bảng Files và FileChecks
    const pool = await poolPromise;

    // Lưu file vào bảng Files
    const insertFileResult = await pool
      .request()
      .input("UserId", userId)
      .input("FileName", originalFileName)
      .input("MimeType", mimeType)
      .input("Size", size)
      .input("FilePath", filePath).query(`
        INSERT INTO Files (UserId, FileName, MimeType, Size, FilePath, UploadTime)
        OUTPUT INSERTED.Id
        VALUES (@UserId, @FileName, @MimeType, @Size, @FilePath, GETDATE())
      `);

    const fileId = insertFileResult.recordset[0].Id;

    // Lưu kết quả quét vào bảng FileChecks
    await pool
      .request()
      .input("FileId", fileId)
      .input("Sha256", sha256)
      .input("IsMalicious", isMalicious ? 1 : 0)
      .input("EngineCount", engineCount)
      .input("TotalEngines", totalEngines).query(`
        INSERT INTO FileChecks (FileId, Sha256, IsMalicious, EngineCount, TotalEngines, CheckedAt)
        VALUES (@FileId, @Sha256, @IsMalicious, @EngineCount, @TotalEngines, GETDATE())
      `);

    fs.unlink(filePath, () => {}); // Xoá file tạm

    res.json({
      isMalicious,
      engineCount,
      totalEngines,
      engines: maliciousEngines,
      sha256,
      fileId,
    });
  } catch (err) {
    console.error("❌ Lỗi scanRoute:", {
      message: err.message,
      stack: err.stack,
      response: err.response?.data || null,
    });
    fs.unlink(filePath, () => {});
    res.status(500).json({ error: "Lỗi khi xử lý file." });
  }
});

module.exports = router;
