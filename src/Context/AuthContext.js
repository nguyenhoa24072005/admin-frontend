import React, { createContext, useContext, useState, useEffect } from "react";

// Tạo Context để quản lý thông tin xác thực
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("authToken"),
    role: localStorage.getItem("role"),
  });

  // Hàm đăng nhập, lưu trữ token và role vào localStorage
  const login = (token, role) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("role", role);
    setAuth({ token, role });
  };

  // Hàm đăng xuất, xóa thông tin xác thực
  const logout = () => {
    localStorage.clear();
    setAuth({ token: null, role: null });
  };

  // Hàm kiểm tra xem người dùng đã đăng nhập hay chưa
  const isAuthenticated = () => {
    return !!auth.token; // Nếu có token thì xem như đã đăng nhập
  };

  // Hàm kiểm tra quyền của người dùng, chuyển cả 2 giá trị về chữ thường để so sánh
  const hasRole = (role) => {
    const userRole = auth.role ? auth.role.toLowerCase() : ""; // Đảm bảo role trong localStorage được chuyển thành chữ thường
    return userRole === role.toLowerCase(); // So sánh với role dưới dạng chữ thường
  };

  // Xử lý khi component được render lần đầu để lấy token và role từ localStorage
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("role");
    if (token && role) {
      setAuth({ token, role });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ auth, login, logout, isAuthenticated, hasRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
