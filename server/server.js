// server.js
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const app = express();
const port = 3001;

// ✅ Cấu hình middleware chung trước khi dùng routes
app.use(
  cors({
    origin: "http://localhost:3000", // Cho phép frontend React truy cập
    credentials: true,
  })
);
app.use(express.json());

// Cấu hình multer để lưu file tạm vào thư mục uploads/
const upload = multer({ dest: "uploads/" });

// ✅ Import routes sau khi middleware đã được cấu hình
const userRoute = require("./routes/usersRoute");
const fileRoute = require("./routes/filesRoute");
const scanRoute = require("./routes/scanRoute");

// Định nghĩa các route
app.use("/api/users", userRoute);
app.use("/api/files", fileRoute);

// Route đặc biệt: upload + scan file dùng multer middleware
app.use("/api/scan", upload.single("file"), scanRoute);

// Khởi động server
app.listen(port, () => {
  console.log(`🚀 Backend running tại http://localhost:${port}`);
});
