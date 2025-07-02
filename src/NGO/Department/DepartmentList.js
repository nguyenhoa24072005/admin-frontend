import React, { useState, useEffect } from "react";
import {
  getDepartments,
  deleteDepartment,
} from "../Service/departmentService";
import DepartmentForm from "./DepartmentForm";

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [editDepartment, setEditDepartment] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState(""); // "Active", "Inactive", or ""
  const [searchTerm, setSearchTerm] = useState("");

  const loadDepartments = async () => {
    try {
      const result = await getDepartments(statusFilter);
      setDepartments(result);
    } catch (error) {
      alert("Failed to load departments.");
    }
  };

  useEffect(() => {
    loadDepartments();
  }, [statusFilter]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await deleteDepartment(id);
      loadDepartments();
    }
  };

  const filteredDepartments = departments.filter((dept) =>
    dept.departmentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>Department List</h2>

      <div style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
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
          onClick={() => {
            setEditDepartment(null);
            setShowForm(true);
          }}
        >
          + Add Department
        </button>
      </div>

      {showForm && (
        <DepartmentForm
          editDepartment={editDepartment}
          onSave={() => {
            setShowForm(false);
            loadDepartments();
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Department Name</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDepartments.length > 0 ? (
            filteredDepartments.map((dept) => (
              <tr key={dept.departmentId}>
                <td>{dept.departmentId}</td>
                <td>{dept.departmentName}</td>
                <td>{dept.status}</td>
                <td>
                  <button
                    onClick={() => {
                      setEditDepartment(dept);
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDelete(dept.departmentId)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No departments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DepartmentList;
