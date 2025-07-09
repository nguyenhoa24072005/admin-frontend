import React, { useState, useEffect } from "react";
import { getDepartments, deleteDepartment } from "../Service/departmentService";
import DepartmentForm from "./DepartmentForm";
import "./Department.css";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [editDepartment, setEditDepartment] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
      // Reset to first page if current page becomes empty
      if (filteredDepartments.length <= 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const filteredDepartments = departments.filter((dept) =>
    dept.departmentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDepartments = filteredDepartments.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="DepartmentContainer">
      <h2>Department List</h2>

      <div className="DepartmentControls">
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
          className="DepartmentAddButton"
          onClick={() => {
            setEditDepartment(null);
            setShowForm(true);
          }}
        >
          <FaPlus style={{ marginRight: 6 }} />
          Add Department
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

      <table className="DepartmentTable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Department Name</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentDepartments.length > 0 ? (
            currentDepartments.map((dept) => (
              <tr key={dept.departmentId}>
                <td>{dept.departmentId}</td>
                <td>{dept.departmentName}</td>
                <td className={`DepartmentStatus ${dept.status}`}>
                  {dept.status}
                </td>
                <td>
                  <button
                    className="DepartmentEditButton"
                    onClick={() => {
                      setEditDepartment(dept);
                      setShowForm(true);
                    }}
                  >
                    <FaEdit style={{ marginRight: 4 }} />
                    Edit
                  </button>
                  <button
                    className="DepartmentDeleteButton"
                    onClick={() => handleDelete(dept.departmentId)}
                  >
                    <FaTrash style={{ marginRight: 4 }} />
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

export default DepartmentList;
