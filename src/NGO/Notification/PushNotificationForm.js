import React, { useState, useEffect } from "react";
import { pushToRoles } from "../Service/notificationService";
import { getRoles } from "../Service/RoleService";
import "./Notification.css";

const PushNotificationForm = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sentBy, setSentBy] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [status, setStatus] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const roles = await getRoles();
        console.log("Roles fetched from API:", roles);
        setAvailableRoles(roles);
      } catch (error) {
        setStatus(`❌ Không thể tải roles: ${error.message}`);
      }
    };
    fetchRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedRoles.length === 0) {
      setStatus("❌ Vui lòng chọn ít nhất một role.");
      return;
    }
    setStatus("Đang gửi...");

    try {
      await pushToRoles(title, message, sentBy, selectedRoles);
      setStatus("✅ Gửi thông báo thành công!");
      setTitle("");
      setMessage("");
      setSentBy("");
      setSelectedRoles([]);
      setIsDropdownOpen(false);
    } catch (error) {
      setStatus(`❌ Lỗi gửi: ${error.message}`);
    }
  };

  const handleRoleToggle = (role) => {
    setSelectedRoles((prev) =>
      prev.includes(role)
        ? prev.filter((r) => r !== role)
        : [...prev, role]
    );
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="PushNotificationForm">
      <h2 className="PushNotificationForm__heading">Gửi thông báo theo Role</h2>
      <form onSubmit={handleSubmit} className="PushNotificationForm__form">
        <div className="PushNotificationForm__field">
          <label className="PushNotificationForm__label">Chọn Roles:</label>
          <div className="PushNotificationForm__dropdown">
            <button
              type="button"
              onClick={toggleDropdown}
              className="PushNotificationForm__dropdown-toggle"
            >
              {selectedRoles.length > 0
                ? `${selectedRoles.length} role(s) selected`
                : "Chọn roles"}
              <span className={`PushNotificationForm__dropdown-icon ${isDropdownOpen ? "open" : ""}`}>
                ▼
              </span>
            </button>
            {isDropdownOpen && (
              <ul className="PushNotificationForm__dropdown-list">
                {availableRoles.map((role, index) => (
                  <li
                    key={role.id || index}
                    className={`PushNotificationForm__dropdown-item ${
                      selectedRoles.includes(role.name || role.roleName)
                        ? "PushNotificationForm__dropdown-item--selected"
                        : ""
                    }`}
                    onClick={() => handleRoleToggle(role.name || role.roleName)}
                  >
                    {role.name || role.roleName}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="PushNotificationForm__field">
          <label className="PushNotificationForm__label">Tiêu đề:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="PushNotificationForm__input"
          />
        </div>
        <div className="PushNotificationForm__field">
          <label className="PushNotificationForm__label">Người gửi:</label>
          <input
            type="text"
            value={sentBy}
            onChange={(e) => setSentBy(e.target.value)}
            required
            className="PushNotificationForm__input"
          />
        </div>
        <div className="PushNotificationForm__field">
          <label className="PushNotificationForm__label">Nội dung:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="PushNotificationForm__textarea"
          />
        </div>
        <button type="submit" className="PushNotificationForm__button">Gửi</button>
      </form>
      {status && <p className="PushNotificationForm__status">{status}</p>}
    </div>
  );
};

export default PushNotificationForm;