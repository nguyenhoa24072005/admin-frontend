// src/Component/LeaveForm.js
import React, { useState, useEffect } from "react";

const LeaveForm = ({ onSave, onCancel, editLeave }) => {
  const [form, setForm] = useState({
    employeeId: "",
    leaveStartDate: "",
    leaveEndDate: "",
    leaveType: "",
  });

  useEffect(() => {
    if (editLeave) {
      setForm({
        employeeId: editLeave.employeeId || "",
        leaveStartDate: editLeave.leaveStartDate?.slice(0, 10) || "",
        leaveEndDate: editLeave.leaveEndDate?.slice(0, 10) || "",
        leaveType: editLeave.leaveType || "",
      });
    }
  }, [editLeave]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{editLeave ? "Edit Leave Request" : "New Leave Request"}</h3>

      <input
        name="employeeId"
        value={form.employeeId}
        onChange={handleChange}
        placeholder="Employee ID"
        required
      />

      <input
        type="date"
        name="leaveStartDate"
        value={form.leaveStartDate}
        onChange={handleChange}
        required
      />

      <input
        type="date"
        name="leaveEndDate"
        value={form.leaveEndDate}
        onChange={handleChange}
        required
      />

      <input
        name="leaveType"
        value={form.leaveType}
        onChange={handleChange}
        placeholder="Leave Type (e.g., Sick, Vacation)"
        required
      />

      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default LeaveForm;
