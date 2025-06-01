import React, { useState } from "react";
import axios from "axios";
import { estimateEntropy, isBase64 } from "../services/cryptoUtils";

const FileAnalyzer = () => {
  const [fileContent, setFileContent] = useState("");
  const [result, setResult] = useState(null);

  // 👉 Hàm gửi file tới backend để quét VirusTotal
  const sendToBackend = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", 1); // ⚠️ Cập nhật ID user nếu cần

    try {
      const res = await axios.post("http://localhost:3001/api/scan", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ Phản hồi từ backend:", res.data);
      alert(
        `Kết quả quét VirusTotal: ${
          res.data.isMalicious ? "❌ NGUY HIỂM" : "✅ AN TOÀN"
        }`
      );
    } catch (err) {
      console.error("❌ Lỗi khi gửi file tới backend:", err.message);
      alert("Không thể kết nối tới server hoặc lỗi từ backend.");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 👉 Gửi file tới backend để quét
    sendToBackend(file);

    // 👉 Đọc nội dung và phân tích nội bộ
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target.result.trim();
      setFileContent(content);

      const analysis = analyzeFile(content);
      setResult(analysis);
    };
    reader.readAsText(file);
  };

  const analyzeFile = (content) => {
    const entropy = estimateEntropy(content);
    const base64 = isBase64(content);
    const length = content.length;

    let securityLevel = "Không an toàn ❌";
    let reason = [];

    if (base64) reason.push("Nội dung là base64");
    if (entropy > 4.5) reason.push(`Entropy cao (${entropy.toFixed(2)})`);
    if (length > 1000) reason.push("Độ dài mã hóa dài hợp lý");

    if (entropy > 5.5 && length > 1000) {
      securityLevel = "An toàn 🔐";
    } else if (entropy > 4.5) {
      securityLevel = "Trung bình ⚠️";
    }

    return {
      entropy,
      isBase64: base64,
      length,
      securityLevel,
      reason,
    };
  };

  return (
    <div
      style={{
        background: "#fff",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        maxWidth: "600px",
        margin: "30px auto",
      }}
    >
      <label style={{ fontWeight: "bold", display: "block", marginBottom: 10 }}>
        Tải file cần phân tích:
      </label>
      <input
        type="file"
        onChange={handleFileUpload}
        style={{ marginBottom: 20 }}
      />

      {result && (
        <div
          style={{
            background: "#f9f9f9",
            padding: 20,
            borderRadius: 8,
            border: "1px solid #ddd",
          }}
        >
          <h3 style={{ marginTop: 0 }}>🔍 Kết quả phân tích</h3>
          <p>
            <strong>📏 Độ dài mã hóa:</strong> {result.length}
          </p>
          <p>
            <strong>📊 Entropy:</strong> {result.entropy.toFixed(4)}
          </p>
          <p>
            <strong>📦 Base64:</strong> {result.isBase64 ? "✅ Có" : "❌ Không"}
          </p>
          <p>
            <strong>🛡️ Đánh giá:</strong> {result.securityLevel}
          </p>
          <p>
            <strong>📝 Lý do:</strong>
          </p>
          <ul>
            {result.reason.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileAnalyzer;
