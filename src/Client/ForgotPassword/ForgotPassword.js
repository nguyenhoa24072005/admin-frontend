import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header/Header";
import "./ForgotPassword.css";

const ForgotAndResetPassword = () => {
  const [step, setStep] = useState("forgot"); // 'forgot' or 'reset'
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isValidEmail = (email) => {
    // Basic email validation regex
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const isValidPassword = (password) => {
    // Check for minimum length and at least one special character
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/;
    return regex.test(password);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const response = await axios.post(
        "https://charitynavigator-hma3agega6fwfgb2.canadacentral-01.azurewebsites.net/api/auth/forgot-password",
        { email }
      );
      setMessage(response.data);
      setStep("reset");
    } catch (err) {
      setError(err.response?.data || "An error occurred. Please try again.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!token) {
      setError("Please enter the reset token.");
      return;
    }

    if (!isValidPassword(newPassword)) {
      setError(
        "Password must be at least 6 characters long, contain a letter, a number, and a special character."
      );
      return;
    }

    try {
      const response = await axios.post(
        "https://shopy-emahgphwbhgpd3bs.japanwest-01.azurewebsites.net/api/auth/reset-password",
        {
          token,
          newPassword,
        }
      );
      setMessage(response.data);
      setStep("forgot");
    } catch (err) {
      setError(err.response?.data || "An error occurred. Please try again.");
    }

    // Redirect to login page after successful password reset
    navigate("/login", { state: { email } });
  };

  return (
    <div className="body-forgotPassword1">
      <Header />
      <div className="form-container11">
        <h2 className="form-container11-h2">
          {step === "forgot" ? "Forgot Password" : "Reset Password"}
        </h2>
        {step === "forgot" ? (
          <form onSubmit={handleForgotPassword} className="form">
            <div className="form-group">
              <div>
                <label className="form-container11-label" htmlFor="email">
                  Enter your email
                </label>
              </div>
              <input
                type="email"
                className="form-container11-input"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-submit">
              Send Reset Link
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="form">
            <div className="form-group">
              <div>
                <labe className="form-group22" htmlFor="token">
                  Reset Token
                </labe>
              </div>
              <input
                className="form-group33"
                type="text"
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <div>
                <label className="form-group22" htmlFor="newPassword">
                  New Password
                </label>
              </div>
              <input
                className="form-group33"
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-submit11">
              Reset Password
            </button>
          </form>
        )}
        {message && <p style={{ color: "white" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
};

export default ForgotAndResetPassword;
