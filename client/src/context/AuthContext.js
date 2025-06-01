import React, { createContext, useState, useEffect } from "react";

// Tạo ngữ cảnh
export const AuthContext = createContext();

// Provider dùng để bao bọc toàn ứng dụng
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Khi load lại trang, kiểm tra localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Hàm login: set user và lưu vào localStorage
  const login = (userObj) => {
    setUser(userObj);
    localStorage.setItem("user", JSON.stringify(userObj));
  };
  
  // Hàm logout: xóa user
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // ✅ Phải truyền setUser vào Provider
  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
