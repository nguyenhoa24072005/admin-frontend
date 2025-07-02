import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const EnterCode = () => {
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email; // Lấy email từ state

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Verification code entered:", code);
    // Xử lý xác thực mã thành công, điều hướng sang trang đổi mật khẩu
    navigate("/reset-password", { state: { email } }); // Gửi email qua state
  };

  return (
    <div className="form-container">
      <h2>Enter Verification Code</h2>
      <p>We've sent a code to your email: {email}</p>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="code">Enter your code</label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-submit">
          Verify
        </button>
      </form>
    </div>
  );
};

export default EnterCode;
