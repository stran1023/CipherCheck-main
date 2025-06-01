// server.js
const express = require("express");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001; // Dùng biến PORT nếu được Render cấp

// ✅ CORS: Cho phép frontend từ Vercel truy cập backend này
app.use(
  cors({
    origin: [
      "http://localhost:3000", // Cho dev local
      "https://cipher-check-fontend.vercel.app",
    ],
    credentials: true,
  })
);

// ✅ Middleware xử lý JSON và file upload
app.use(express.json());
const upload = multer({ dest: "uploads/" }); // lưu file tạm vào thư mục uploads/

// ✅ Import routes
const userRoute = require("./routes/usersRoute");
const fileRoute = require("./routes/filesRoute");
const scanRoute = require("./routes/scanRoute");

// ✅ Gán route
app.use("/api/users", userRoute);
app.use("/api/files", fileRoute);
app.use("/api/scan", upload.single("file"), scanRoute); // xử lý upload + scan

// ✅ Khởi động server
app.listen(port, () => {
  const env = process.env.NODE_ENV || "development";
  const baseUrl =
    env === "production"
      ? "https://ciphercheck-main.onrender.com"
      : `http://localhost:${port}`;
  console.log(`🚀 Backend running tại ${baseUrl}`);
});
