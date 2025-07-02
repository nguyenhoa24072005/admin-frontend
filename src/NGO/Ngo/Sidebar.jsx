import React from "react";
import { BsCart3, BsGrid1X2Fill, BsFillArchiveFill } from "react-icons/bs";
import { Link, useLocation } from "react-router-dom";
import { FaBuildingNgo } from "react-icons/fa6";
import { FaDonate } from "react-icons/fa";
import { BsImages } from "react-icons/bs";
import "./Ngo.css";

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  const location = useLocation();

  // Hàm kiểm tra nếu đường dẫn hiện tại khớp với link
  const isActive = (path) => location.pathname.includes(path);

  return (
    <aside
      id="sidebar"
      className={openSidebarToggle ? "sidebar-responsive" : ""}
    >
      <div className="sidebar-title">
        <div className="sidebar-brand">
          <BsCart3 className="icon_header" /> NGO
        </div>
        <span className="icon close_icon" onClick={OpenSidebar}>
          X
        </span>
      </div>

      <ul className="sidebar-list">
        <li className={`sidebar-list-item ${isActive('/ngo/dashboard') ? 'active' : ''}`}>
          <Link to="/ngo/dashboard" className="sidebar-link">
            <BsGrid1X2Fill className="icon-1" /> Dashboard
          </Link>
        </li>
        <li className={`sidebar-list-item ${isActive('/ngo/departments') ? 'active' : ''}`}>
          <Link to="/ngo/departments" className="sidebar-link">
            <BsFillArchiveFill className="icon-1" /> Departments
          </Link>
        </li>
        <li className={`sidebar-list-item ${isActive('/ngo/Positions') ? 'active' : ''}`}>
          <Link to="/ngo/Positions" className="sidebar-link">
            <FaBuildingNgo className="icon-1" /> Positions
          </Link>
        </li>
        <li className={`sidebar-list-item ${isActive('/ngo/Employees') ? 'active' : ''}`}>
          <Link to="/ngo/Employees" className="sidebar-link">
            <FaDonate className="icon-1" /> Employee
          </Link>
        </li>
        <li className={`sidebar-list-item ${isActive('/ngo/Users') ? 'active' : ''}`}>
          <Link to="/ngo/Users" className="sidebar-link">
            <BsImages className="icon-1" /> User
          </Link>
        </li>
        <li className={`sidebar-list-item ${isActive('/ngo/Roles') ? 'active' : ''}`}>
          <Link to="/ngo/Roles" className="sidebar-link">
            <BsImages className="icon-1" /> Roles
          </Link>
        </li>
        <li className={`sidebar-list-item ${isActive('/ngo/EmployeeHistory') ? 'active' : ''}`}>
          <Link to="/ngo/EmployeeHistory" className="sidebar-link">
            <BsImages className="icon-1" /> EmployeeHistory
          </Link>
        </li>
        <li className={`sidebar-list-item ${isActive('/ngo/QRInfo') ? 'active' : ''}`}>
          <Link to="/ngo/QRInfo" className="sidebar-link">
            <BsImages className="icon-1" /> QRInfo
          </Link>
        </li>
        <li className={`sidebar-list-item ${isActive('/ngo/QRAttendance') ? 'active' : ''}`}>
          <Link to="/ngo/QRAttendance" className="sidebar-link">
            <BsImages className="icon-1" /> QRAttendance
          </Link>
        </li>
        <li className={`sidebar-list-item ${isActive('/ngo/Leave') ? 'active' : ''}`}>
          <Link to="/ngo/Leave" className="sidebar-link">
            <BsImages className="icon-1" /> Leave
          </Link>
        </li>
        <li className={`sidebar-list-item ${isActive('/ngo/WorkScheduleInfo') ? 'active' : ''}`}>
          <Link to="/ngo/WorkScheduleInfo" className="sidebar-link">
            <BsImages className="icon-1" /> WorkScheduleInfo
          </Link>
        </li>
        <li className={`sidebar-list-item ${isActive('/ngo/WorkSchedule') ? 'active' : ''}`}>
          <Link to="/ngo/WorkSchedule" className="sidebar-link">
            <BsImages className="icon-1" /> WorkSchedule
          </Link>
        </li>
        <li className={`sidebar-list-item ${isActive('/ngo/Attendance') ? 'active' : ''}`}>
          <Link to="/ngo/Attendance" className="sidebar-link">
            <BsImages className="icon-1" /> Attendance
          </Link>
        </li>
        {/* <li className='sidebar-list-item'>
          <Link to="/admin/user" className="sidebar-link">
            <BsPeopleFill className='icon' /> User
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/admin/order" className="sidebar-link">
            <BsListCheck className='icon' /> Order
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/admin/newsBook" className="sidebar-link">
            <BsListCheck className='icon' /> News Book
          </Link>
        </li> */}
        {/* <li className='sidebar-list-item'>
          <Link to="/admin/createorder" className="sidebar-link"> 
            <BsListCheck className='icon' /> Order Detail
          </Link>
        </li> */}
      </ul>
    </aside>
  );
}

export default Sidebar;
