// src/Component/UserList.js
import React, { useEffect, useState } from "react";
import { getUsers, registerUser, updateUser, deleteUser } from "../Service/UserService";
import UserForm from "./UserForm";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const loadUsers = async () => {
    try {
      const data = await getUsers(statusFilter);
      setUsers(data);
    } catch (error) {
      alert("Failed to load users.");
    }
  };

  useEffect(() => {
    loadUsers();
  }, [statusFilter]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await deleteUser(id);
      loadUsers();
    }
  };

  const handleSave = async (form) => {
    try {
      if (editUser) {
        await updateUser(editUser.userId, form);
      } else {
        await registerUser(form);
      }
      setShowForm(false);
      loadUsers();
    } catch (err) {
      alert("Failed to save user");
    }
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: 20 }}>
      <h2>User List</h2>

      <div style={{ marginBottom: 15, display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Search by username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <button
          onClick={() => {
            setEditUser(null);
            setShowForm(true);
          }}
        >
          + Add User
        </button>
      </div>

      {showForm && (
        <UserForm
          editUser={editUser}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}

      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((u) => (
              <tr key={u.userId}>
                <td>{u.userId}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.status}</td>
                <td>
                  <button
                    onClick={() => {
                      setEditUser(u);
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDelete(u.userId)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
