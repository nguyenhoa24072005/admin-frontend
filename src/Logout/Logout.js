// Logout.js
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Logout = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    if (onLogout) onLogout(); // Đóng dropdown khi logout
    navigate("/login");
  };

  return (
    <div className="logout-item1" onClick={handleLogout}>
      <FontAwesomeIcon icon={faSignOutAlt} className="logout-icon" />
    </div>
  );
};

export default Logout;
