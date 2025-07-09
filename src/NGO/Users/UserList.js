import React, { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../Service/UserService";
import UserForm from "./UserForm";
import "./User.css";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteUser(id);
      loadUsers();
      // Reset to previous page if current page becomes empty
      if (filteredUsers.length <= 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="UserContainer">
      <h2>User List</h2>

      <div className="UserControls">
        <input
          type="text"
          placeholder="Search by username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <button
          className="UserAddButton"
          onClick={() => {
            setEditUser(null);
            setShowForm(true);
          }}
        >
          <FaPlus style={{ marginRight: 6 }} />
          Add User
        </button>
      </div>

      {showForm && (
        <UserForm
          editUser={editUser}
          onSave={() => {
            setShowForm(false);
            loadUsers();
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <table className="UserTable">
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
          {currentUsers.length > 0 ? (
            currentUsers.map((u) => (
              <tr key={u.userId}>
                <td>{u.userId}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td className={`UserStatus ${u.status}`}>{u.status}</td>
                <td>
                  <button
                    className="UserEditButton"
                    onClick={() => {
                      setEditUser(u);
                      setShowForm(true);
                    }}
                  >
                    <FaEdit style={{ marginRight: 4 }} />
                    Edit
                  </button>
                  <button
                    className="UserDeleteButton"
                    onClick={() => handleDelete(u.userId)}
                  >
                    <FaTrash style={{ marginRight: 4 }} />
                    Delete
                  </button>
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

      {totalPages > 1 && (
        <div className="PaginationControls">
          <button
            className="PaginationButton"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FaArrowLeft style={{ marginRight: 6 }} />
            Previous
          </button>
          <div className="PaginationNumbers">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  className={`PaginationNumber ${
                    currentPage === page ? "active" : ""
                  }`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              )
            )}
          </div>
          <button
            className="PaginationButton"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <FaArrowRight style={{ marginLeft: 6 }} />
          </button>
        </div>
      )}
    </div>
  );
};

export default UserList;
