const express = require("express");
const { poolPromise } = require("../db/sqlClient");

const router = express.Router();

router.post("/upload", async (req, res) => {
  const { userId, fileName, mimeType, size, filePath } = req.body;

  if (!userId || !fileName) {
    return res.status(400).json({ error: "Thiếu thông tin file hoặc userId" });
  }

  try {
    const pool = await poolPromise;

    await pool
      .request()
      .input("UserId", userId)
      .input("FileName", fileName)
      .input("MimeType", mimeType || null)
      .input("Size", size || 0)
      .input("FilePath", filePath || null)
      .query(
        `INSERT INTO Files (UserId, FileName, MimeType, Size, FilePath) 
         VALUES (@UserId, @FileName, @MimeType, @Size, @FilePath)`
      );

    res.status(201).json({ message: "Đã lưu file metadata" });
  } catch (err) {
    console.error("Lỗi lưu file:", err.message);
    res.status(500).json({ error: "Lỗi server khi lưu file" });
  }
});

module.exports = router;
