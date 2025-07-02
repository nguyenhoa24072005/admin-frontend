import React from "react";
import "./TabNavigation.css";

const TabNavigation = ({ activeTab, onTabChange }) => {
  return (
    <div className="tabs">
      <button
        onClick={() => onTabChange("info")}
        className={activeTab === "info" ? "active" : ""}
      >
        Personal Info
      </button>
      <button
        onClick={() => onTabChange("donations")}
        className={activeTab === "donations" ? "active" : ""}
      >
        Donation History
      </button>
      <button
        onClick={() => onTabChange("edit")}
        className={activeTab === "edit" ? "active" : ""}
      >
        Edit Profile
      </button>
    </div>
  );
};

export default TabNavigation;
