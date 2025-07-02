import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./ResetPassword.css";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const location = useLocation();
  const email = location.state?.email || "example@example.com";

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
    setErrorMessage("");

    // Kiểm tra mật khẩu
    const passwordError = isPasswordValid(password);
    if (passwordError) {
      setErrorMessage(passwordError);
      return;
    }

    // Kiểm tra mật khẩu khớp
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch(
        "https://charitynavigator-hma3agega6fwfgb2.canadacentral-01.azurewebsites.net/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (response.ok) {
        alert("Password reset successfully!");
        // Thực hiện chuyển hướng sau khi thành công
      } else {
        const data = await response.json();
        setErrorMessage(data.message || "An error occurred.");
      }
    } catch (error) {
      setErrorMessage("Failed to reset password. Please try again later.");
    }
  };

  return (
    <div className="form-container">
      <h2>Reset Password</h2>
      <p>
        Reset password for: <strong>{email}</strong>
      </p>
      <form onSubmit={handleSubmit} className="form">
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="form-group">
          <label htmlFor="password">New Password</label>
        </div>
        <div>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <div>
            <label htmlFor="confirmPassword">Confirm New Password</label>
          </div>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-submit">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
