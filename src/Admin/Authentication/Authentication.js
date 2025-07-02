import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { IoMenu, IoSearch } from "react-icons/io5";
import { FaRegTimesCircle } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import Logout from "../../Logout/Logout";

import "./Authentication.css";

function Authentication() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar visibility
  const [isRightMenuOpen, setIsRightMenuOpen] = useState(false); // State for right menu
  const location = useLocation();

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Toggle right menu visibility
  const toggleRightMenu = () => {
    setIsRightMenuOpen(!isRightMenuOpen);
  };

  // Function to check if the current link is active
  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="logo">
          <a className="admin-dark">
            <img
              src="https://www.charitynavigator.org/content/dam/cn/cn/logos/CharityNav_Logo_Hor1.png"
              className="admin-light"
              alt="Logo"
            />
          </a>
        </div>
        <nav className="admin-nav">
          <ul>
            <li className={isActive("dashboard") ? "active" : ""}>
              <Link to="dashboard">Dashboard</Link>
            </li>
            <li className={isActive("customers") ? "active" : ""}>
              <Link to="customers">Customers</Link>
            </li>
            <li className={isActive("ngoadmin") ? "active" : ""}>
              <Link to="ngoadmin">Ngo</Link>
            </li>
            <li className={isActive("programadmin") ? "active" : ""}>
              <Link to="programadmin">Program</Link>
            </li>
            <li className={isActive("programdonattion") ? "active" : ""}>
              <Link to="programdonation">Donation</Link>
            </li>
            {/* <li className={isActive("censorngo") ? "active" : ""}>
              <Link to="censorngo">Ngo and Program</Link>
            </li> */}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Top Navigation */}
        <nav className="admin-vs">
          <div className="admin-right">
            <div className="admin-isolate">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search..."
                  className="search-input"
                />
                <button className="search-btn">
                  <IoSearch />
                </button>
              </div>
            </div>

            {/* Gmail Icon */}
            <div className="icon gmail-icon">
              <MdOutlineEmail />
            </div>

            {/* Notification Icon */}
            <div className="icon notification-icon">
              <IoMdNotificationsOutline />
            </div>

            {/* User Info */}
            <div className="user-info">
              <Logout />
            </div>
          </div>
        </nav>

        {/* Mobile menu */}
        <div className="admin-inhud">
          <button className="admin-icon" onClick={toggleSidebar}>
            <IoMenu />
          </button>

          <div className="logo1">
            <a className="admin-dark1">
              <img
                src="https://modernize-nextjs.adminmart.com/images/logos/dark-logo.svg"
                className="admin-light"
                alt="Logo"
              />
            </a>
          </div>

          <button className="admin-icon1" onClick={toggleRightMenu}>
            <BsThreeDotsVertical />
          </button>
        </div>

        {/* Sidebar for mobile */}
        <div
          className={`admin-overlay ${isSidebarOpen ? "show" : ""}`}
          onClick={toggleSidebar}
        ></div>
        <nav className={`admin-mobile ${isSidebarOpen ? "open" : ""}`}>
          <div className="admin-mobile-close" onClick={toggleSidebar}>
            <FaRegTimesCircle />
          </div>
          <ul className="admin-mobile-link">
            <li>
              <Link to="dashboard" className="admin-mobile-list">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="customers" className="admin-mobile-list">
                Customers
              </Link>
            </li>
            <li>
              <Link to="ngoadmin" className="admin-mobile-list">
                Ngo
              </Link>
            </li>
            <li>
              <Link to="programadmin" className="admin-mobile-list">
                Program
              </Link>
            </li>
            <li>
              <Link to="programdonatelist1" className="admin-mobile-list">
                Donation
              </Link>
            </li>
            <li>
              <Link to="censorngo" className="admin-mobile-list">
                CensorNgo
              </Link>
            </li>
          </ul>
        </nav>

        {/* Outlet for nested routes */}
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Authentication;
