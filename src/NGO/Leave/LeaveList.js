// src/Component/LeaveList.js
import React, { useEffect, useState } from "react";
import {
  getLeaves,
  createLeave,
  deleteLeave,
} from "../Service/leaveService";
import LeaveForm from "./LeaveForm";

const LeaveList = () => {
  const [leaves, setLeaves] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editLeave, setEditLeave] = useState(null);

  const loadLeaves = async () => {
    try {
      const data = await getLeaves();
      setLeaves(data);
    } catch (err) {
      alert("Failed to fetch leave requests");
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const handleSave = async (form) => {
    try {
      await createLeave(form);
      setShowForm(false);
      loadLeaves();
    } catch (err) {
      alert("Failed to save leave request");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await deleteLeave(id);
      loadLeaves();
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Leave Requests</h2>

      <button
        onClick={() => {
          setEditLeave(null);
          setShowForm(true);
        }}
        style={{ marginBottom: 10 }}
      >
        + New Leave Request
      </button>

      {showForm && (
        <LeaveForm
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
          editLeave={editLeave}
        />
      )}

      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Employee</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Type</th>
            <th>Status</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaves.length > 0 ? (
            leaves.map((l) => (
              <tr key={l.leaveId}>
                <td>{l.leaveId}</td>
                <td>{l.employeeName}</td>
                <td>{l.leaveStartDate?.slice(0, 10)}</td>
                <td>{l.leaveEndDate?.slice(0, 10)}</td>
                <td>{l.leaveType}</td>
                <td>{l.status}</td>
                <td>{l.activeStatus}</td>
                <td>
                  <button onClick={() => handleDelete(l.leaveId)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                No leave requests found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveList;
