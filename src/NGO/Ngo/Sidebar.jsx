import React from "react";
import { BsGrid1X2Fill } from "react-icons/bs";
import {
  FaBuilding,
  FaUsers,
  FaUser,
  FaUserTag,
  FaHistory,
  FaQrcode,
  FaCalendarTimes,
  FaCalendarAlt,
  FaCalendar,
  FaCheckCircle,
} from "react-icons/fa";
import { MdWork } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import "./Ngo.css";

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  const location = useLocation();

  const isActive = (path) => location.pathname.includes(path);

  return (
    <aside
      id="sidebar"
      className={openSidebarToggle ? "sidebar-responsive" : ""}
    >
      <div className="sidebar-title">
        <div className="sidebar-brand">
          <BsGrid1X2Fill className="icon_header" /> HR Admin
        </div>
        <span className="icon close_icon" onClick={OpenSidebar}>
          X
        </span>
      </div>

      <ul className="sidebar-list">
        <li
          className={`sidebar-list-item ${
            isActive("/ngo/dashboard") ? "active" : ""
          }`}
        >
          <Link to="/ngo/dashboard" className="sidebar-link">
            <BsGrid1X2Fill className="icon-1" /> Dashboard
          </Link>
        </li>
        <li
          className={`sidebar-list-item ${
            isActive("/ngo/departments") ? "active" : ""
          }`}
        >
          <Link to="/ngo/departments" className="sidebar-link">
            <FaBuilding className="icon-1" /> Departments
          </Link>
        </li>
        <li
          className={`sidebar-list-item ${
            isActive("/ngo/Positions") ? "active" : ""
          }`}
        >
          <Link to="/ngo/Positions" className="sidebar-link">
            <MdWork className="icon-1" /> Positions
          </Link>
        </li>
        <li
          className={`sidebar-list-item ${
            isActive("/ngo/Employees") ? "active" : ""
          }`}
        >
          <Link to="/ngo/Employees" className="sidebar-link">
            <FaUsers className="icon-1" /> Employees
          </Link>
        </li>
        <li
          className={`sidebar-list-item ${
            isActive("/ngo/Users") ? "active" : ""
          }`}
        >
          <Link to="/ngo/Users" className="sidebar-link">
            <FaUser className="icon-1" /> Users
          </Link>
        </li>
        <li
          className={`sidebar-list-item ${
            isActive("/ngo/Roles") ? "active" : ""
          }`}
        >
          <Link to="/ngo/Roles" className="sidebar-link">
            <FaUserTag className="icon-1" /> Roles
          </Link>
        </li>
        <li
          className={`sidebar-list-item ${
            isActive("/ngo/EmployeeHistory") ? "active" : ""
          }`}
        >
          <Link to="/ngo/EmployeeHistory" className="sidebar-link">
            <FaHistory className="icon-1" /> Employee History
          </Link>
        </li>
        <li
          className={`sidebar-list-item ${
            isActive("/ngo/QRInfo") ? "active" : ""
          }`}
        >
          <Link to="/ngo/QRInfo" className="sidebar-link">
            <FaQrcode className="icon-1" /> QR Info
          </Link>
        </li>
        <li
          className={`sidebar-list-item ${
            isActive("/ngo/QRAttendance") ? "active" : ""
          }`}
        >
          <Link to="/ngo/QRAttendance" className="sidebar-link">
            <FaQrcode className="icon-1" /> QR Attendance
          </Link>
        </li>
        <li
          className={`sidebar-list-item ${
            isActive("/ngo/Leave") ? "active" : ""
          }`}
        >
          <Link to="/ngo/Leave" className="sidebar-link">
            <FaCalendarTimes className="icon-1" /> Leave
          </Link>
        </li>
        <li
          className={`sidebar-list-item ${
            isActive("/ngo/WorkScheduleInfo") ? "active" : ""
          }`}
        >
          <Link to="/ngo/WorkScheduleInfo" className="sidebar-link">
            <FaCalendarAlt className="icon-1" /> Work Schedule Info
          </Link>
        </li>
        <li
          className={`sidebar-list-item ${
            isActive("/ngo/WorkSchedule") ? "active" : ""
          }`}
        >
          <Link to="/ngo/WorkSchedule" className="sidebar-link">
            <FaCalendar className="icon-1" /> Work Schedule
          </Link>
        </li>
        <li
          className={`sidebar-list-item ${
            isActive("/ngo/Attendance") ? "active" : ""
          }`}
        >
          <Link to="/ngo/Attendance" className="sidebar-link">
            <FaCheckCircle className="icon-1" /> Attendance
          </Link>
        </li>
        <li
          className={`sidebar-list-item ${
            isActive("/ngo/AttendanceAppeal") ? "active" : ""
          }`}
        >
          <Link to="/ngo/AttendanceAppeal" className="sidebar-link">
            <FaCheckCircle className="icon-1" /> AttendanceAppeal
          </Link>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
