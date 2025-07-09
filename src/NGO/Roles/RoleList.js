import React, { useEffect, useState } from "react";
import { getRoles, deleteRole } from "../Service/RoleService";
import RoleForm from "./RoleForm";
import "./Role.css";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

const RoleList = () => {
  const [roles, setRoles] = useState([]);
  const [editRole, setEditRole] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const loadRoles = async () => {
    try {
      const data = await getRoles(statusFilter);
      setRoles(data);
    } catch (error) {
      console.error("Failed to load roles:", error);
      alert("Failed to load roles.");
    }
  };

  useEffect(() => {
    loadRoles();
  }, [statusFilter]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      await deleteRole(id);
      loadRoles();
      // Reset to previous page if current page becomes empty
      if (filteredRoles.length <= 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const filteredRoles = roles.filter((role) =>
    role.roleName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRoles = filteredRoles.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="RoleContainer">
      <h2>Role List</h2>

      <div className="RoleControls">
        <input
          type="text"
          placeholder="Search by name..."
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
          className="RoleAddButton"
          onClick={() => {
            setEditRole(null);
            setShowForm(true);
          }}
        >
          <FaPlus style={{ marginRight: 6 }} />
          Add Role
        </button>
      </div>

      {showForm && (
        <RoleForm
          editRole={editRole}
          onSave={() => {
            setShowForm(false);
            loadRoles();
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <table className="RoleTable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRoles.length > 0 ? (
            currentRoles.map((r) => (
              <tr key={r.roleId}>
                <td>{r.roleId}</td>
                <td>{r.roleName}</td>
                <td>{r.description}</td>
                <td className={`RoleStatus ${r.status}`}>{r.status}</td>
                <td>
                  <button
                    className="RoleEditButton"
                    onClick={() => {
                      setEditRole(r);
                      setShowForm(true);
                    }}
                  >
                    <FaEdit style={{ marginRight: 4 }} />
                    Edit
                  </button>
                  <button
                    className="RoleDeleteButton"
                    onClick={() => handleDelete(r.roleId)}
                  >
                    <FaTrash style={{ marginRight: 4 }} />
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No roles found.
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

export default RoleList;
