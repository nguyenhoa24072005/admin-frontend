import React, { useState } from "react";
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

  const toggleDropdown = () => {
    setIsDropdownVisible((prev) => !prev);
  };

  return (
    <header className="HeaderContainer">
      <div className="HeaderMenuIcon">
        <BsJustify className="HeaderIcon" onClick={OpenSidebar} />
      </div>
      {/* <div className="HeaderLeft">
        <BsSearch className="HeaderIcon" />
      </div> */}
      <div className="HeaderRight">
        <BsFillBellFill className="HeaderIcon" />
        <BsFillEnvelopeFill className="HeaderIcon" />
        <div className="HeaderProfile">
          <BsPersonCircle className="HeaderIcon" onClick={toggleDropdown} />
          {isDropdownVisible && (
            <div className="HeaderDropdown">
              <Logout onLogout={() => setIsDropdownVisible(false)} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
