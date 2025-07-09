import React, { useState, useEffect } from "react";
import { getPositions, deletePosition } from "../Service/positionService";
import PositionForm from "./PositionForm";
import "./Position.css";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

const PositionList = () => {
  const [positions, setPositions] = useState([]);
  const [editPosition, setEditPosition] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const loadPositions = async () => {
    try {
      const result = await getPositions(statusFilter);
      setPositions(result);
    } catch (error) {
      alert("Failed to load positions.");
    }
  };

  useEffect(() => {
    loadPositions();
  }, [statusFilter]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this position?")) {
      await deletePosition(id);
      loadPositions();
      // Reset to previous page if current page becomes empty
      if (filteredPositions.length <= 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const filteredPositions = positions.filter((pos) =>
    pos.positionName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredPositions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPositions = filteredPositions.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="PositionContainer">
      <h2>Position List</h2>

      <div className="PositionControls">
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
          className="PositionAddButton"
          onClick={() => {
            setEditPosition(null);
            setShowForm(true);
          }}
        >
          <FaPlus style={{ marginRight: 6 }} />
          Add Position
        </button>
      </div>

      {showForm && (
        <PositionForm
          editPosition={editPosition}
          onSave={() => {
            setShowForm(false);
            loadPositions();
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <table className="PositionTable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Position Name</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentPositions.length > 0 ? (
            currentPositions.map((pos) => (
              <tr key={pos.positionId}>
                <td>{pos.positionId}</td>
                <td>{pos.positionName}</td>
                <td className={`PositionStatus ${pos.status}`}>{pos.status}</td>
                <td>
                  <button
                    className="PositionEditButton"
                    onClick={() => {
                      setEditPosition(pos);
                      setShowForm(true);
                    }}
                  >
                    <FaEdit style={{ marginRight: 4 }} />
                    Edit
                  </button>
                  <button
                    className="PositionDeleteButton"
                    onClick={() => handleDelete(pos.positionId)}
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
                No positions found.
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

export default PositionList;
