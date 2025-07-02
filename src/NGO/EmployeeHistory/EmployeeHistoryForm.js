// src/Component/EmployeeHistoryForm.js
import React, { useEffect, useState } from "react";
import {
  createHistory,
  updateHistory,
} from "../Service/EmployeeHistoryService";

const EmployeeHistoryForm = ({ editingHistory, onClose }) => {
  const [form, setForm] = useState({
    employeeId: "",
    departmentId: "",
    positionId: "",
    startDate: "",
    endDate: "",
    reason: "",
    status: "WORKING",
  });

  useEffect(() => {
    if (editingHistory) {
      setForm({
        employeeId: editingHistory.employeeId,
        departmentId: editingHistory.departmentId,
        positionId: editingHistory.positionId,
        startDate: editingHistory.startDate,
        endDate: editingHistory.endDate,
        reason: editingHistory.reason,
        status: editingHistory.status,
      });
    }
  }, [editingHistory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingHistory) {
        await updateHistory(editingHistory.historyId, form);
      } else {
        await createHistory(form);
      }
      onClose();
    } catch (err) {
      alert("Save failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <h3>{editingHistory ? "Edit" : "Add"} Employee History</h3>

      <input
        name="employeeId"
        value={form.employeeId}
        onChange={handleChange}
        placeholder="Employee ID"
        required
      />

      <input
        name="departmentId"
        value={form.departmentId}
        onChange={handleChange}
        placeholder="Department ID"
        required
      />

      <input
        name="positionId"
        value={form.positionId}
        onChange={handleChange}
        placeholder="Position ID"
        required
      />

      <input
        type="date"
        name="startDate"
        value={form.startDate}
        onChange={handleChange}
        required
      />

      <input
        type="date"
        name="endDate"
        value={form.endDate}
        onChange={handleChange}
      />

      <input
        name="reason"
        value={form.reason}
        onChange={handleChange}
        placeholder="Reason"
      />

      <select name="status" value={form.status} onChange={handleChange}>
        <option value="WORKING">WORKING</option>
        <option value="RESIGNED">RESIGNED</option>
      </select>

      <div>
        <button type="submit">Save</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EmployeeHistoryForm;
