const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const path = require("path");

const app = express();
const port = 3001;

app.use(cors());
const upload = multer({ dest: "uploads/" });

require("dotenv").config();
const VT_API_KEY = process.env.VT_API_KEY;

app.post("/api/scan", upload.single("file"), async (req, res) => {
  const filePath = req.file.path;

  try {
    // 1. Upload file
    const form = new FormData();
    form.append("file", fs.createReadStream(filePath));

    const uploadResponse = await axios.post(
      "https://www.virustotal.com/api/v3/files",
      form,
      {
        headers: {
          ...form.getHeaders(),
          "x-apikey": VT_API_KEY,
        },
      }
    );

    // ✅ Đây là `analysis_id`, KHÔNG phải SHA256
    const analysisId = uploadResponse.data.data.id;
    const analysisUrl = `https://www.virustotal.com/api/v3/analyses/${analysisId}`;

    let sha256 = null;
    let attempts = 0;
    while (attempts < 30) {
      const analysisRes = await axios.get(analysisUrl, {
        headers: { "x-apikey": VT_API_KEY },
      });

      const status = analysisRes.data.data.attributes.status;
      if (status === "completed") {
        sha256 = analysisRes.data.meta.file_info.sha256;
        break;
      }

      await new Promise((r) => setTimeout(r, 4000));
      attempts++;
    }

    if (!sha256) {
      fs.unlink(filePath, () => {});
      return res.status(500).json({ error: "Không thể lấy SHA256 sau khi phân tích" });
    }

    // 3. Lấy thông tin chi tiết bằng SHA256
    const fileInfoUrl = `https://www.virustotal.com/api/v3/files/${sha256}`;
    const fileInfoRes = await axios.get(fileInfoUrl, {
      headers: { "x-apikey": VT_API_KEY },
    });

    fs.unlink(filePath, () => {});

    const fileData = fileInfoRes.data.data;
    const stats = fileData.attributes.last_analysis_stats;
    const analysisResults = fileData.attributes.last_analysis_results;

    const maliciousEngines = Object.entries(analysisResults)
      .filter(([_, val]) => val.category === "malicious" || val.category === "suspicious")
      .map(([engine]) => engine);

    res.json({
      isMalicious: maliciousEngines.length > 0,
      engineCount: stats.malicious,
      totalEngines: stats.harmless + stats.malicious + stats.undetected + stats.suspicious,
      engines: maliciousEngines,
      sha256: sha256,
    });
    
  } catch (err) {
    console.error("Lỗi gửi file đến VirusTotal:", err.message);
    fs.unlink(filePath, () => {});
    if (err.response?.status === 413) {
      return res.status(413).json({
        error: "File quá lớn! Tài khoản miễn phí VirusTotal chỉ cho phép tối đa 32MB.",
      });
    }
    res.status(500).json({ error: "Lỗi khi gửi file tới VirusTotal." });
  }
});

app.listen(port, () => {
  console.log(`🚀 Backend running at http://localhost:${port}`);
});