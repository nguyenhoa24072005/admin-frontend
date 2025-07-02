// src/components/PositionList.js
import React, { useState, useEffect } from "react";
import {
  getPositions,
  deletePosition,
} from "../Service/positionService";
import PositionForm from "./PositionForm";

const PositionList = () => {
  const [positions, setPositions] = useState([]);
  const [editPosition, setEditPosition] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState(""); // "Active", "Inactive", or ""
  const [searchTerm, setSearchTerm] = useState("");

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
    }
  };

  const filteredPositions = positions.filter((pos) =>
    pos.positionName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>Position List</h2>

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
            setEditPosition(null);
            setShowForm(true);
          }}
        >
          + Add Position
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

      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Position Name</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPositions.length > 0 ? (
            filteredPositions.map((pos) => (
              <tr key={pos.positionId}>
                <td>{pos.positionId}</td>
                <td>{pos.positionName}</td>
                <td>{pos.status}</td>
                <td>
                  <button
                    onClick={() => {
                      setEditPosition(pos);
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDelete(pos.positionId)}>
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
    </div>
  );
};

export default PositionList;
