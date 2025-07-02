import React, { useState, useEffect } from "react";

const AttendanceForm = ({ editData, onSave, onCancel }) => {
  const [form, setForm] = useState({
    employee: { employeeId: "" },
    attendanceDate: "",
    totalHours: "",
    status: "Present",
  });

  useEffect(() => {
    if (editData) {
      setForm({
        employee: { employeeId: editData.employee.employeeId },
        attendanceDate: editData.attendanceDate?.slice(0, 10),
        totalHours: editData.totalHours || "",
        status: editData.status || "Present",
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "employeeId") {
      setForm((prev) => ({ ...prev, employee: { employeeId: value } }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{editData ? "Edit Attendance" : "Add Attendance"}</h3>

      <input
        name="employeeId"
        value={form.employee.employeeId}
        onChange={handleChange}
        placeholder="Employee ID"
        required
      />

      <input
        type="date"
        name="attendanceDate"
        value={form.attendanceDate}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        step="0.01"
        name="totalHours"
        value={form.totalHours}
        onChange={handleChange}
        placeholder="Total Hours"
      />

      <select name="status" value={form.status} onChange={handleChange} required>
        <option value="Present">Present</option>
        <option value="Absent">Absent</option>
        <option value="Late">Late</option>
        <option value="OnLeave">OnLeave</option>
      </select>

      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default AttendanceForm;
