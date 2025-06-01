// server/db/sqlClient.js
const sql = require("mssql");

const config = {
  user: "sqlserver",
  password: "123",
  server: "34.81.128.240", // IP Cloud SQL Server của bạn
  database: "CipherCheckDB", // Nhớ tạo DB này trước nhé
  port: 1433, // Port mặc định cho SQL Server
  options: {
    encrypt: true, // ⚠️ BẮT BUỘC với cloud
    trustServerCertificate: true,
  },
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("✅ Đã kết nối tới SQL Server trên Cloud");
    return pool;
  })
  .catch((err) => {
    console.error("❌ Lỗi kết nối SQL Server:", err);
  });

module.exports = {
  sql,
  poolPromise,
};
