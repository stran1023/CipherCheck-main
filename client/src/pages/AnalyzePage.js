import React, { useState, useContext } from "react";
import FileAnalyzer from "../components/FileAnalyzer";
import MalwareScanner from "../components/MalwareScanner";
import TabSwitcher from "../components/TabSwitcher";
import backgroundImg from "../assets/background.jpg";
import { AuthContext } from "../context/AuthContext"; // 👈 Thêm dòng này

const AnalyzePage = () => {
  const [tab, setTab] = useState("encryption");
  const { logout, user } = useContext(AuthContext); // 👈 Lấy logout từ context

  return (
    <div
      style={{
        minHeight: "100vh",
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
        position: "relative", // 👈 Cho phép nút đặt ở góc
      }}
    >
      {/* 👇 Nút đăng xuất */}
      {user && (
        <button
          onClick={logout}
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            padding: "8px 16px",
            backgroundColor: "#ff4d4d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Đăng xuất
        </button>
      )}

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
