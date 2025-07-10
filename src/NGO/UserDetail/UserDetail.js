import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getUserById } from "../Service/UserService";

const UserDetail = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserById(userId); // Gọi API đúng endpoint
        setUser(data);
      } catch (error) {
        console.error("Lỗi khi tải chi tiết người dùng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <div>Đang tải...</div>;
  if (!user) return <div>Không tìm thấy người dùng</div>;

  return (
    <div className="user-detail">
      <h2>Thông tin chi tiết tài khoản</h2>
      <p>
        <strong>ID:</strong> {user.userId}
      </p>
      <p>
        <strong>Tên đăng nhập:</strong> {user.username}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Vai trò:</strong> {user.role}
      </p>
      <p>
        <strong>Trạng thái:</strong> {user.status}
      </p>
      <Link to="/ngo/users">Quay lại danh sách</Link>
    </div>
  );
};

export default UserDetail;
