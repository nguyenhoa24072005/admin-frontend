import React, { useState, useEffect } from "react";
import "./EditProfile.css";

const EditProfile = ({ userData }) => {
  // Khởi tạo các state ngay từ đầu
  const [username, setUsername] = useState(userData?.username || "");
  const [email, setEmail] = useState(userData?.email || "");
  const [dateOfBirth, setDateOfBirth] = useState(userData?.dateOfBirth || "");
  const [profileImage, setProfileImage] = useState(
    userData?.profileImage || ""
  );

  // Sử dụng useEffect để cập nhật dữ liệu khi userData thay đổi
  useEffect(() => {
    if (userData) {
      setUsername(userData.username);
      setEmail(userData.email);
      setDateOfBirth(userData.dateOfBirth);
      setProfileImage(userData.profileImage);
    }
  }, [userData]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const updatedUserData = {
      username,
      email,
      dateOfBirth,
      profileImage,
    };

    // Xử lý gửi dữ liệu cập nhật (ví dụ: gửi request API)
    console.log("Updated user data:", updatedUserData);
  };

  return (
    <div className="edit-profile">
      <h3>Edit Profile</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Date of Birth:</label>
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
        </div>
        <div>
          <label>Profile Image URL:</label>
          <input
            type="text"
            value={profileImage}
            onChange={(e) => setProfileImage(e.target.value)}
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditProfile;
