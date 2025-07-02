import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileInfo.css";

const ProfileInfo = ({ userData }) => {
  const navigate = useNavigate();

  // Kiểm tra xem userData có tồn tại hay không
  if (!userData) {
    return <p>Loading...</p>; // Hiển thị loading khi chưa có dữ liệu
  }

  const handleEditClick = () => {
    // Điều hướng tới trang chỉnh sửa khi người dùng click vào biểu tượng chỉnh sửa
    navigate("/edit-profile");
  };

  return (
    <div className="profile-info">
      <div className="profile-header">
        <img
          src={userData.profileImage || "https://via.placeholder.com/100"} // Kiểm tra nếu không có ảnh thì dùng ảnh mặc định
          alt="Profile"
          className="profile-image"
        />
        {/* Thêm biểu tượng chỉnh sửa */}
      </div>
      <p>
        <strong>Username:</strong> {userData.username}
      </p>
      <p>
        <strong>Email:</strong> {userData.email}
      </p>
      <p>
        <strong>Date of Birth:</strong> {userData.dateOfBirth}
      </p>
      {/* Edit icon */}
      <button onClick={handleEditClick} className="edit-icon">
        ✏️ {/* Hoặc bạn có thể thay bằng một icon hoặc ảnh logo */}
      </button>
    </div>
  );
};

export default ProfileInfo;
