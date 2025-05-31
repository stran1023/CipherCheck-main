import React, { useState } from "react";
import FileAnalyzer from "../components/FileAnalyzer";
import MalwareScanner from "../components/MalwareScanner";
import TabSwitcher from "../components/TabSwitcher";
import backgroundImg from "../assets/background.jpg"

const AnalyzePage = () => {
  const [tab, setTab] = useState("encryption");

  return (
    <div style={{
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
    }}>
      <h2 style={{ textAlign: "center", fontSize: "28px", marginBottom: "20px", color: "white" }}>
        Chúng tôi có thể giúp gì cho bạn :&#41;&#41;
      </h2>

      <TabSwitcher currentTab={tab} setTab={setTab} />

      {tab === "encryption" && <FileAnalyzer />}
      {tab === "malware" && <MalwareScanner />}
    </div>
  );
};

export default AnalyzePage;
