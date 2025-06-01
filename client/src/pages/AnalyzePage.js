import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import FileAnalyzer from "../components/FileAnalyzer";
import MalwareScanner from "../components/MalwareScanner";
import TabSwitcher from "../components/TabSwitcher";
import { AuthContext } from "../context/AuthContext"; // 👈 thêm dòng này
import backgroundImg from "../assets/background.jpg";

const AnalyzePage = () => {
  const [tab, setTab] = useState("encryption");
  const { logout } = useContext(AuthContext); // 👈 lấy logout từ context
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.clear();
    navigate("/login"); // 👈 chuyển về trang login
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 60,
      }}
    >
      {/* Nút logout */}
      <button
        onClick={handleLogout}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          backgroundColor: "#ef4444",
          color: "#fff",
          border: "none",
          padding: "10px 16px",
          borderRadius: 8,
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Đăng xuất
      </button>

      <h2
        style={{
          textAlign: "center",
          fontSize: "28px",
          marginBottom: "20px",
          color: "white",
        }}
      >
        Chúng tôi có thể giúp gì cho bạn
      </h2>

      <TabSwitcher currentTab={tab} setTab={setTab} />

      {tab === "encryption" && <FileAnalyzer />}
      {tab === "malware" && <MalwareScanner />}
    </div>
  );
};

export default AnalyzePage;
