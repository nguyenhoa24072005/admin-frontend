import React, { useState } from "react";
import axios from "axios";
import "./RegisterForm.css"; // Nếu cần tùy chỉnh CSS cho form
import Header from "../Components/Header/Header";
import { Link, useNavigate } from "react-router-dom"; // Để chuyển hướng sau khi đăng ký thành công

const RegisterForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const API_URL =
    "https://charitynavigator-hma3agega6fwfgb2.canadacentral-01.azurewebsites.net/api/auth"; // Thay đổi API_URL nếu cần

  // Kiểm tra email hợp lệ
  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Kiểm tra mật khẩu hợp lệ
  const isPasswordValid = (password) => {
    const minLength = 8;
    const hasNumber = /\d/;
    const hasUpperCase = /[A-Z]/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

    if (password.length < minLength) {
      return "Password must be at least 8 characters.";
    }
    if (!hasNumber.test(password)) {
      return "Password must include at least one number.";
    }
    if (!hasUpperCase.test(password)) {
      return "Password must include at least one uppercase letter.";
    }
    if (!hasSpecialChar.test(password)) {
      return "Password must include at least one special character.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Kiểm tra các trường bắt buộc
    if (
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !email ||
      !username ||
      !password ||
      !confirmPassword
    ) {
      setError("All fields are required!");
      return;
    }

    // Kiểm tra email hợp lệ
    if (!isEmailValid(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Kiểm tra mật khẩu hợp lệ
    const passwordError = isPasswordValid(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    // Kiểm tra mật khẩu khớp
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      // Gửi dữ liệu đăng ký lên backend
      const response = await axios.post(`${API_URL}/register`, {
        firstName,
        lastName,
        dateOfBirth,
        email,
        username,
        password,
      });

      // Nếu thành công, hiển thị thông báo thành công và chuyển hướng
      setSuccess("Registration successful! Redirecting to login page...");
      setTimeout(() => {
        navigate("/login"); // Chuyển hướng đến trang đăng nhập sau 3 giây
      }, 3000);
    } catch (err) {
      setError(err.response?.data || "Registration failed. Please try again.");
      setSuccess("");
    }
  };

  return (
    <div className="body-register">
      <Header />
      <div className="form-container-register">
        {/* <img
        src="https://d20umu42aunjpx.cloudfront.net/_gfx_/main/CN_Logo_New2022.png"
        className="register-img"
      />
      <h2 className="register-h2">Welcome</h2>
      <p className="register-p">
        Register in to Charity Navigator to continue.
      </p> */}

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <form onSubmit={handleSubmit} className="form-register">
          <div className="form-register-left-right">
            <div className="form-register-left">
              <div className="form-group-register1">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group-register1">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group-register2">
                <label htmlFor="dateOfBirth">Date of Birth</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required
                />
              </div>
              <div className="form-group-register2">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-register-right">
              <div className="form-group-register3">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group-register3">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group-register4">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <div className="form-register-button">
            <button type="submit" className="btn-submit-register">
              Register
            </button>
            <div className="additional-links">
              <div className="conten-register">
                Already have an account?{" "}
                <Link to="/login" className="login-link-register">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
