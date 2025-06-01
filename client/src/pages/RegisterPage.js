import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Vui lòng nhập đầy đủ tài khoản và mật khẩu");
      return;
    }

    if (password !== confirm) {
      alert("Mật khẩu xác nhận không khớp");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "{}");

    if (users[username]) {
      alert("Tên người dùng đã tồn tại");
      return;
    }

    users[username] = password;
    localStorage.setItem("users", JSON.stringify(users));
    alert("Đăng ký thành công. Mời đăng nhập!");
    navigate("/login");
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
      <h2 style={{ marginBottom: 20 }}>Đăng ký tài khoản</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Tên đăng nhập"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: "100%", marginBottom: 15, padding: 10 }}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", marginBottom: 15, padding: 10 }}
        />
        <input
          type="password"
          placeholder="Xác nhận mật khẩu"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          style={{ width: "100%", marginBottom: 20, padding: 10 }}
        />
        <button
          type="submit"
          style={{
            padding: 10,
            width: "100%",
            backgroundColor: "#22c55e",
            color: "#fff",
            border: "none",
            borderRadius: 6,
          }}
        >
          Đăng ký
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
