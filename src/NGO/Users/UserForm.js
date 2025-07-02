// src/Component/UserForm.js
import React, { useState, useEffect } from "react";

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
    <form onSubmit={handleSubmit}>
      <h3>{editUser ? "Edit User" : "Add User"}</h3>

      <input
        name="employeeId"
        value={form.employeeId}
        onChange={handleChange}
        placeholder="Employee ID"
      />

      <input
        name="username"
        value={form.username}
        onChange={handleChange}
        placeholder="Username"
        required
      />

      <input
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
        required={!editUser}
      />

      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />

      <input
        name="roleId"
        value={form.roleId}
        onChange={handleChange}
        placeholder="Role ID"
      />

      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default UserForm;
