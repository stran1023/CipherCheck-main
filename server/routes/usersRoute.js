const express = require("express");
const bcrypt = require("bcryptjs");
const { poolPromise } = require("../db/sqlClient");

const router = express.Router();

// Đăng ký
router.post("/register", async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Thiếu username hoặc password" });
  }

  try {
    const pool = await poolPromise;
    const checkUser = await pool
      .request()
      .input("Username", username)
      .query("SELECT * FROM Users WHERE Username = @Username");

    if (checkUser.recordset.length > 0) {
      return res.status(409).json({ error: "Username đã tồn tại" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await pool
      .request()
      .input("Username", username)
      .input("PasswordHash", passwordHash)
      .input("Email", email?.trim() === "" ? null : email)
      .query(
        `INSERT INTO Users (Username, PasswordHash, Email) 
        OUTPUT INSERTED.Id
        VALUES (@Username, @PasswordHash, @Email)`
      );

    console.log("✅ Đăng ký thành công:", username);
    res.status(201).json({ message: "Đăng ký thành công", username });
  } catch (err) {
    console.error("❌ Lỗi đăng ký:", err);
    res.status(500).json({ error: "Lỗi server khi đăng ký" });
  }
});
// Đăng nhập
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Thiếu username hoặc password" });
  }

  try {
    const pool = await poolPromise;
    const userQuery = await pool
      .request()
      .input("Username", username)
      .query("SELECT * FROM Users WHERE Username = @Username");

    if (userQuery.recordset.length === 0) {
      console.log("❌ Không tìm thấy username:", username);
      return res.status(401).json({ error: "Sai tài khoản hoặc mật khẩu" });
    }

    const user = userQuery.recordset[0];

    const match = await bcrypt.compare(password, user.PasswordHash);

    if (!match) {
      return res.status(401).json({ error: "Sai tài khoản hoặc mật khẩu" });
    }
    console.log("✅ Trả dữ liệu:", {
      userId: user.Id,
      username: user.Username,
    });
    res.status(200).json({
      message: "Đăng nhập thành công",
      userId: user.Id,
      username: user.Username,
    });
  } catch (err) {
    console.error("❌ Lỗi khi đăng nhập:", err);
    res.status(500).json({ error: "Lỗi server khi đăng nhập" });
  }
});

module.exports = router;
