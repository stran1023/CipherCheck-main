import React from "react";

const TabSwitcher = ({ currentTab, setTab }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
      <button
        onClick={() => setTab("encryption")}
        style={{
          padding: "10px 20px",
          border: "none",
          borderBottom: currentTab === "encryption" ? "3px solid #0ea5e9" : "none",
          backgroundColor: "transparent",
          fontWeight: "bold",
          color: currentTab === "encryption" ? "#0ea5e9" : "#333",
          cursor: "pointer",
        }}
      >
        🔐 Kiểm tra mã hóa
      </button>
      <button
        onClick={() => setTab("malware")}
        style={{
          padding: "10px 20px",
          border: "none",
          borderBottom: currentTab === "malware" ? "3px solid #f43f5e" : "none",
          backgroundColor: "transparent",
          fontWeight: "bold",
          color: currentTab === "malware" ? "#f43f5e" : "#333",
          cursor: "pointer",
        }}
      >
        💣 Kiểm tra mã độc
      </button>
    </div>
  );
};

export default TabSwitcher;
