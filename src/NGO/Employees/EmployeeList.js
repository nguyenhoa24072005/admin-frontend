import React, { useEffect, useState } from "react";
import {
  getEmployees,
  deleteEmployee,
} from "../Service/employeeService";
import EmployeeForm from "./EmployeeForm";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [editEmployee, setEditEmployee] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const loadEmployees = async () => {
    try {
      const data = await getEmployees(statusFilter);
      setEmployees(data);
    } catch (error) {
      alert("Failed to load employees.");
    }
  };

  useEffect(() => {
    loadEmployees();
  }, [statusFilter]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await deleteEmployee(id);
      loadEmployees();
    }
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: 20 }}>
      <h2>Employee List</h2>

      <div style={{ marginBottom: 15, display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Search by full name..."
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
            setEditEmployee(null);
            setShowForm(true);
          }}
        >
          + Add Employee
        </button>
      </div>

      {showForm && (
        <EmployeeForm
          editEmployee={editEmployee}
          onSave={() => {
            setShowForm(false);
            loadEmployees();
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Gender</th>
            <th>Phone</th>
            <th>Department</th>
            <th>Position</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((emp) => (
              <tr key={emp.employeeId}>
                <td>{emp.employeeId}</td>
                <td>{emp.fullName}</td>
                <td>{emp.gender}</td>
                <td>{emp.phone}</td>
                <td>{emp.departmentName}</td>
                <td>{emp.positionName}</td>
                <td>{emp.status}</td>
                <td>
                  <button
                    onClick={() => {
                      setEditEmployee(emp);
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDelete(emp.employeeId)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                No employees found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
