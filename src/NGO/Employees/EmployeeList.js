import React, { useState, useEffect } from "react";
import { getEmployees, deleteEmployee } from "../Service/employeeService";
import EmployeeForm from "./EmployeeForm";
import "./Employee.css";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [editEmployee, setEditEmployee] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const loadEmployees = async () => {
    try {
      const data = await getEmployees(statusFilter, roleFilter);
      setEmployees(data);
    } catch (error) {
      alert("Failed to load employees.");
    }
  };

  useEffect(() => {
    loadEmployees();
  }, [statusFilter, roleFilter]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      await deleteEmployee(id);
      loadEmployees();
      if (filteredEmployees.length <= 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="EmployeeContainer">
      <h2>Employee List</h2>

      <div className="EmployeeControls">
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
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="User">User</option>
          <option value="Hr">Hr</option>
          <option value="Admin">Admin</option>
        </select>

        <button
          className="EmployeeAddButton"
          onClick={() => {
            setEditEmployee(null);
            setShowForm(true);
          }}
        >
          <FaPlus style={{ marginRight: 6 }} />
          Add Employee
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

      <table className="EmployeeTable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Gender</th>
            <th>Phone</th>
            <th>Department</th>
            <th>Position</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentEmployees.length > 0 ? (
            currentEmployees.map((emp) => (
              <tr key={emp.employeeId}>
                <td>{emp.employeeId}</td>
                <td>{emp.fullName}</td>
                <td>{emp.gender}</td>
                <td>{emp.phone}</td>
                <td>{emp.departmentName}</td>
                <td>{emp.positionName}</td>
                <td>{emp.roleName || "-"}</td>
                <td className={`EmployeeStatus ${emp.status}`}>{emp.status}</td>
                <td>
                  <button
                    className="EmployeeEditButton"
                    onClick={() => {
                      setEditEmployee(emp);
                      setShowForm(true);
                    }}
                  >
                    <FaEdit style={{ marginRight: 4 }} />
                    Edit
                  </button>
                  <button
                    className="EmployeeDeleteButton"
                    onClick={() => handleDelete(emp.employeeId)}
                  >
                    <FaTrash style={{ marginRight: 4 }} />
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>
                No employees found.
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

export default EmployeeList;
