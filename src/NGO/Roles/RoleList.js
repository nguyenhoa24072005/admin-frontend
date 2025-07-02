// src/Component/RoleList.js
import React, { useEffect, useState } from "react";
import { getRoles, addRole, updateRole, deleteRole } from "../Service/RoleService";
import RoleForm from "./RoleForm";

const RoleList = () => {
  const [roles, setRoles] = useState([]);
  const [editRole, setEditRole] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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
    if (window.confirm("Are you sure?")) {
      await deleteRole(id);
      loadRoles();
    }
  };

  const handleSave = async (form) => {
    try {
      if (editRole) {
        await updateRole(editRole.roleId, form);
      } else {
        await addRole(form);
      }
      setShowForm(false);
      loadRoles();
    } catch (err) {
      console.error("Failed to save role:", err);
      alert("Failed to save role");
    }
  };

  const filteredRoles = roles.filter((role) =>
    role.roleName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: 20 }}>
      <h2>Role List</h2>

      <div style={{ marginBottom: 15, display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Search by name..."
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
            setEditRole(null);
            setShowForm(true);
          }}
        >
          + Add Role
        </button>
      </div>

      {showForm && (
        <RoleForm
          editRole={editRole}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}

      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
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
          {filteredRoles.length > 0 ? (
            filteredRoles.map((r) => (
              <tr key={r.roleId}>
                <td>{r.roleId}</td>
                <td>{r.roleName}</td>
                <td>{r.description}</td>
                <td>{r.status}</td>
                <td>
                  <button
                    onClick={() => {
                      setEditRole(r);
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDelete(r.roleId)}>Delete</button>
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
    </div>
  );
};

export default RoleList;
