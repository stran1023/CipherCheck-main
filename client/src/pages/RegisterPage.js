import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const RegisterPage = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const { login } = useContext(AuthContext); // 🔄 sử dụng hàm login từ context
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const res = await axios.post(
        "https://ciphercheck-main.onrender.com/api/users/register",
        form
      );

      console.log("✅ Đăng ký thành công:", res.data);

      // 👉 Gọi login sau khi đăng ký thành công
      login(res.data.username);
      setMessage(res.data.message);
      navigate("/analyze");
    } catch (err) {
      console.error("❌ Đăng ký thất bại:", err);

      if (err.response?.status === 409) {
        setError("Tên người dùng đã tồn tại.");
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Đăng ký thất bại.");
      }
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "40px auto",
        padding: 30,
        border: "1px solid #ddd",
        borderRadius: 10,
        backgroundColor: "#fff",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2>Đăng ký tài khoản</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 15 }}>
          <label>Tên đăng nhập:</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label>Mật khẩu:</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label>Email (tuỳ chọn):</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <button type="submit" style={{ padding: 10, width: "100%" }}>
          Đăng ký
        </button>
      </form>

      {message && !error && (
        <p style={{ color: "green", marginTop: 15 }}>{message}</p>
      )}
      {error && <p style={{ color: "red", marginTop: 15 }}>{error}</p>}
    </div>
  );
};

export default RegisterPage;
