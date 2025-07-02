import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import LoginWithGoogle from "./LoginWithGoogle/LoginWithGoogle";
import Header from "../Components/Header/Header";
import AuthService from "../Service/AuthService";
import "./LoginForm.css";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [errorMessages, setErrorMessages] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (role) => {
    if (role === "Admin") {
      navigate("/ngo", { state: { message: "Welcome Admin!" } });
    } else {
      setError("Access denied. Only Admins can log in.");
    }
  };

  const loginRequest = async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await AuthService.login({ username, password });

      if (!response.success) {
        setError(response.message || "Login failed.");
        return;
      }

      const { token, userId } = response.result;

      // ✅ Giải mã token để lấy role
      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.Role || decodedToken.role;

      // ✅ Chỉ cho phép Admin đăng nhập
      if (userRole !== "Admin") {
        setError("Access denied. Only Admins can log in.");
        return;
      }

      // ✅ Lưu thông tin vào localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("role", userRole);
      localStorage.setItem("userId", userId);

      handleNavigation(userRole);
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let errors = {};

    if (!username) {
      errors.username = "Please enter your username!";
    }

    if (!password) {
      errors.password = "Please enter your password!";
    }

    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      return;
    }

    setErrorMessages({});
    loginRequest(username, password);
  };

  return (
    <div className="body-login">
      <Header />
      <div className="form-container-login">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group-login">
            <label htmlFor="username" className="conten-login">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={errorMessages.username ? "input-error" : ""}
              placeholder="Enter your username"
            />
            {errorMessages.username && (
              <small className="error-text">{errorMessages.username}</small>
            )}
          </div>

          <div className="form-group-login">
            <label htmlFor="password" className="conten-login">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errorMessages.password ? "input-error" : ""}
              placeholder="Enter your password"
            />
            {errorMessages.password && (
              <small className="error-text">{errorMessages.password}</small>
            )}
          </div>

          {error && <p className="error-message">{error}</p>}

          <Link to="/forgot-password" className="login-link1">
            Forgot Password?
          </Link>

          <button type="submit" className="btn-submit-login" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="additional-links-login">
          <p className="login-link1-p">
            Don't have an account?
            <Link to="/register" className="login-link2"> Register here.</Link>
          </p>
          <Link to="/" className="login-link3">Back to Home</Link>
        </div>

        {/* Nếu dùng đăng nhập bằng Google */}
        <LoginWithGoogle onLoginSuccess={() => {}} />
      </div>
    </div>
  );
};

export default LoginForm;
