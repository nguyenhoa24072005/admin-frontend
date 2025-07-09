import React, { useState, useEffect } from "react";
import { FaSave, FaTimes } from "react-icons/fa";
import "./User.css";

const UserForm = ({ editUser, onSave, onCancel }) => {
  const [form, setForm] = useState({
    employeeId: "",
    username: "",
    password: "",
    email: "",
    roleId: "",
  });

  useEffect(() => {
    if (editUser) {
      setForm({
        employeeId: editUser.employeeId || "",
        username: editUser.username || "",
        password: "", // không hiển thị mật khẩu cũ
        email: editUser.email || "",
        roleId: editUser.roleId || "",
      });
    }
  }, [editUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <>
      <div className="UserOverlay" onClick={onCancel} />
      <div className="UserModal">
        <form className="UserForm" onSubmit={handleSubmit}>
          <h3>{editUser ? "Edit User" : "Add User"}</h3>

          <div className="UserFormGrid">
            <div className="UserFormField">
              <label>Employee ID:</label>
              <input
                name="employeeId"
                value={form.employeeId}
                onChange={handleChange}
                placeholder="Employee ID"
              />
            </div>

            <div className="UserFormField">
              <label>Username:</label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Username"
                required
              />
            </div>

            <div className="UserFormField">
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                required={!editUser}
              />
            </div>

            <div className="UserFormField">
              <label>Email:</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
            </div>

            <div className="UserFormField">
              <label>Role ID:</label>
              <input
                name="roleId"
                value={form.roleId}
                onChange={handleChange}
                placeholder="Role ID"
              />
            </div>
          </div>

          <div className="UserFormButtons">
            <button type="submit" className="UserSaveButton">
              <FaSave style={{ marginRight: 5 }} />
              Save
            </button>
            <button
              type="button"
              className="UserCancelButton"
              onClick={onCancel}
            >
              <FaTimes style={{ marginRight: 5 }} />
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UserForm;
