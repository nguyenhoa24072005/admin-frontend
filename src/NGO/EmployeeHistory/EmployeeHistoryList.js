// src/Component/EmployeeHistoryList.js
import React, { useEffect, useState } from "react";
import {
  getAllHistories,
  getHistoriesByEmployeeId,
  deleteHistory,
} from "../Service/EmployeeHistoryService";
import EmployeeHistoryForm from "./EmployeeHistoryForm";

const EmployeeHistoryList = () => {
  const [histories, setHistories] = useState([]);
  const [editingHistory, setEditingHistory] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [employeeIdFilter, setEmployeeIdFilter] = useState("");

  const loadHistories = async () => {
    try {
      const data = employeeIdFilter
        ? await getHistoriesByEmployeeId(employeeIdFilter)
        : await getAllHistories();
      setHistories(data);
    } catch (err) {
      alert("Failed to load employee histories.");
    }
  };

  useEffect(() => {
    loadHistories();
  }, [employeeIdFilter]);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this history?")) {
      await deleteHistory(id);
      loadHistories();
    }
  };

  const handleEdit = (history) => {
    setEditingHistory(history);
    setShowForm(true);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Employee History List</h2>

      <div style={{ marginBottom: 10 }}>
        <input
          type="text"
          placeholder="Filter by Employee ID"
          value={employeeIdFilter}
          onChange={(e) => setEmployeeIdFilter(e.target.value)}
        />
        <button onClick={() => setShowForm(true)}>+ Add History</button>
      </div>

      {showForm && (
        <EmployeeHistoryForm
          editingHistory={editingHistory}
          onClose={() => {
            setEditingHistory(null);
            setShowForm(false);
            loadHistories();
          }}
        />
      )}

      <table border="1" cellPadding="8" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Employee</th>
            <th>Department</th>
            <th>Position</th>
            <th>Start</th>
            <th>End</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {histories.map((h) => (
            <tr key={h.historyId}>
              <td>{h.historyId}</td>
              <td>{h.employeeName}</td>
              <td>{h.departmentName}</td>
              <td>{h.positionName}</td>
              <td>{h.startDate}</td>
              <td>{h.endDate}</td>
              <td>{h.reason}</td>
              <td>{h.status}</td>
              <td>
                <button onClick={() => handleEdit(h)}>Edit</button>
                <button onClick={() => handleDelete(h.historyId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeHistoryList;
