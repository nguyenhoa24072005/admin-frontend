import React, { useState } from "react";
import {
  BsFillBellFill,
  BsFillEnvelopeFill,
  BsPersonCircle,
  BsJustify,
} from "react-icons/bs";
import { Link } from "react-router-dom";
import Logout from "../../Logout/Logout";
import "./Header.css";

function Header({ OpenSidebar }) {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const userId = localStorage.getItem("userId");

  const toggleDropdown = () => {
    setIsDropdownVisible((prev) => !prev);
  };

  return (
    <header className="HeaderContainer">
      {/* <div className="HeaderMenuIcon">
        <BsJustify className="HeaderIcon" onClick={OpenSidebar} />
      </div> */}

      <div className="HeaderRight">
        <BsFillBellFill className="HeaderIcon" />
        {/* <BsFillEnvelopeFill className="HeaderIcon" /> */}
        <div className="HeaderProfile">
          <BsPersonCircle className="HeaderIcon" onClick={toggleDropdown} />
          {isDropdownVisible && (
            <div className="HeaderDropdown">
              {/* Thêm link đến thông tin tài khoản */}

              <Logout onLogout={() => setIsDropdownVisible(false)} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
