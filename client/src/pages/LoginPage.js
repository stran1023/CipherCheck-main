import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3001/api/users/login", {
        username,
        password,
      });

      console.log("✅ Đăng nhập thành công:", res.data);
      login(res.data.username);
      navigate("/analyze");
    } catch (err) {
      console.error(
        "❌ Đăng nhập thất bại:",
        err.response?.data || err.message
      );
      alert("Sai tài khoản hoặc mật khẩu");
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "80px auto",
        background: "#fff",
        padding: 30,
        borderRadius: 12,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ marginBottom: 20 }}>Đăng nhập</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tên đăng nhập"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 15, padding: 10 }}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 15, padding: 10 }}
        />
        <button
          type="submit"
          style={{
            padding: 10,
            width: "100%",
            backgroundColor: "#0ea5e9",
            color: "#fff",
            border: "none",
            borderRadius: 6,
          }}
        >
          Đăng nhập
        </button>
        <button
          type="button"
          onClick={() => navigate("/register")}
          style={{
            marginTop: 10,
            width: "100%",
            padding: 10,
            backgroundColor: "#f3f4f6",
            border: "1px solid #ddd",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Đăng ký tài khoản mới
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
