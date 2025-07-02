import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom"; // Import NavLink
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faUser } from "@fortawesome/free-solid-svg-icons";
import { useFavorites } from "../../../Context/FavoritesContext";
import Logout from "../../../Logout/Logout";
import "./Header.css";

export const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Trạng thái đăng nhập
  const [isScrolled, setIsScrolled] = useState(false); // Theo dõi scroll
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy danh sách yêu thích từ context
  const { favorites } = useFavorites(); // Correct usage of the custom hook

  // Kiểm tra token trong localStorage khi component mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      setIsAuthenticated(!!token);
    };

    checkAuth();

    const handleLoginStatusChange = () => checkAuth();

    window.addEventListener("loginStatusChanged", handleLoginStatusChange);
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("loginStatusChanged", handleLoginStatusChange);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  // Theo dõi trạng thái scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Xử lý chuyển hướng khi nhấn vào biểu tượng người dùng
  const handleUserClick = () => {
    if (isAuthenticated) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  // Check current page to determine if we are on a special page (Home, Login, Register)
  const isHomePage = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";
  const isOtherPage = !isHomePage && !isLoginPage && !isRegisterPage;

  // Determine header className based on the current page
  let headerClass = "";
  if (isLoginPage || isRegisterPage) {
    headerClass = "transparent"; // Transparent for login and register pages
  } else if (isScrolled) {
    headerClass = "scrolled"; // Scrolled for pages when user scrolls
  } else if (isOtherPage) {
    headerClass = "other-page"; // Styles for other pages
  }

  return (
    <div className={`header-container ${headerClass}`}>
      {/* Logo */}
      <div className="logo-search-container">
        <div className="logo-header">
          <img
            src="https://www.charitynavigator.org/content/dam/cn/cn/logos/CharityNav_Logo_Hor1.png"
            alt="logo"
          />
        </div>
      </div>

      {/* Navigation Links */}
      <div className="navbar-header-link">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/program"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
        >
          Program
        </NavLink>
        <NavLink
          to="/ngos"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
        >
          Ngos
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
        >
          About
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
        >
          Contact
        </NavLink>
      </div>

      {/* Auth and Favorites */}
      <div className="navbar-header-container3">
        {/* Favorites Icon */}
        <div className="favorites">
          <NavLink className="favorites-link1" to="/favorites">
            <FontAwesomeIcon icon={faHeart} className="favorites-icon1" />
            {favorites.length > 0 && (
              <span className="favorites-count">{favorites.length}</span>
            )}
          </NavLink>
        </div>

        {/* User Icon */}
        <div className="user-icon" onClick={handleUserClick}>
          <FontAwesomeIcon icon={faUser} className="user-icon-style" />
        </div>

        {/* Logout Icon (Only visible when authenticated) */}
        {isAuthenticated && (
          <Logout onLogout={() => setIsAuthenticated(false)} />
        )}
      </div>
    </div>
  );
};

export default Header;
