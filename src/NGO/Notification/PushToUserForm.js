import React, { useState, useEffect } from "react";
import { pushToUser } from "../Service/notificationService";
import { getUsers } from "../Service/UserService";
import { jwtDecode } from "jwt-decode";
import "./Notification.css";

const PushToUserForm = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [senderId, setSenderId] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userList = await getUsers();
        setUsers(userList);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng:", error);
        setStatus(`❌ Lỗi: ${error.message}`);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setSenderId(decoded.userId || decoded.id);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedUsers.length === 0) {
      setStatus("❌ Vui lòng chọn ít nhất một người dùng.");
      return;
    }
    setStatus("Đang gửi...");

    try {
      await Promise.all(
        selectedUsers.map((userId) =>
          pushToUser(userId, title, message, senderId)
        )
      );
      setStatus("✅ Thông báo đã gửi tới người dùng thành công!");
      setSelectedUsers([]);
      setTitle("");
      setMessage("");
      setIsDropdownOpen(false);
    } catch (error) {
      setStatus(`❌ Lỗi: ${error.message}`);
    }
  };

  const handleUserToggle = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="PushToUserForm">
      <h2 className="PushToUserForm__heading">Gửi Thông Báo Tới Người Dùng</h2>
      <form onSubmit={handleSubmit} className="PushToUserForm__form">
        <div className="PushToUserForm__field">
          <label className="PushToUserForm__label">Chọn người dùng:</label>
          <div className="PushToUserForm__dropdown">
            <button
              type="button"
              onClick={toggleDropdown}
              className="PushToUserForm__dropdown-toggle"
            >
              {selectedUsers.length > 0
                ? `${selectedUsers.length} người dùng được chọn`
                : "Chọn người dùng"}
              <span className={`PushToUserForm__dropdown-icon ${isDropdownOpen ? "open" : ""}`}>
                ▼
              </span>
            </button>
            {isDropdownOpen && (
              <ul className="PushToUserForm__dropdown-list">
                {users.map((user) => (
                  <li
                    key={user.userId}
                    className={`PushToUserForm__dropdown-item ${
                      selectedUsers.includes(user.userId)
                        ? "PushToUserForm__dropdown-item--selected"
                        : ""
                    }`}
                    onClick={() => handleUserToggle(user.userId)}
                  >
                    {user.username || user.email || user.name} (ID: {user.userId})
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="PushToUserForm__field">
          <label className="PushToUserForm__label">Tiêu đề:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="PushToUserForm__input"
          />
        </div>
        <div className="PushToUserForm__field">
          <label className="PushToUserForm__label">Nội dung:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="PushToUserForm__textarea"
          />
        </div>
        <button type="submit" className="PushToUserForm__button">Gửi thông báo</button>
      </form>
      {status && <p className="PushToUserForm__status">{status}</p>}
    </div>
  );
};

export default PushToUserForm;