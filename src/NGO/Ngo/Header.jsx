import React, { useState, useEffect } from "react";
import {
  BsFillBellFill,
  BsFillEnvelopeFill,
  BsPersonCircle,
  BsSearch,
  BsJustify,
} from "react-icons/bs";
import Logout from "../../Logout/Logout";
import "./Header.css";

function Header({ OpenSidebar }) {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  // Use useEffect to set dropdown visibility when the component mounts
  useEffect(() => {
    setIsDropdownVisible(true); // Show the dropdown immediately when the component mounts
  }, []);

  return (
    <header className="header3">
      <div className="menu-icon">
        <BsJustify className="icon" onClick={OpenSidebar} />
      </div>
      <div className="header-left">
        <BsSearch className="icon" />
      </div>
      <div className="header-right">
        <BsFillBellFill className="icon" />
        <BsFillEnvelopeFill className="icon" />

        {/* Always show the menu dropdown */}
        {isDropdownVisible && (
          <div className="menu-logout">
            <Logout onLogout={() => setIsDropdownVisible(false)} />
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
