import React, { useState, useEffect } from "react";
import { getEmployees } from "../Service/employeeService";
import "./Attendance.css";
import { FaSave, FaTimes } from "react-icons/fa";

const AttendanceForm = ({ editData, onSave, onCancel }) => {
  const [form, setForm] = useState({
    employee: { employeeId: "" },
    attendanceDate: "",
    totalHours: "",
    status: "Present",
  });
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployees("Active");
        setEmployees(data.sort((a, b) => a.fullName.localeCompare(b.fullName)));
      } catch (err) {
        console.error("Failed to fetch employees:", err);
        alert("Failed to fetch employees.");
      }
    };
    fetchEmployees();

    if (editData) {
      setForm({
        employee: { employeeId: editData.employee?.employeeId || "" },
        attendanceDate: editData.attendanceDate?.slice(0, 10) || "",
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
    const payload = {
      ...form,
      totalHours: form.totalHours ? parseFloat(form.totalHours) : 0,
      attendanceDate: form.attendanceDate
        ? new Date(form.attendanceDate).toISOString().split("T")[0]
        : "",
    };
    onSave(payload);
  };

  return (
    <div className="AttendanceModal">
      <form className="AttendanceForm" onSubmit={handleSubmit}>
        <h3>{editData ? "Edit Attendance" : "Add Attendance"}</h3>

        <div className="AttendanceFormGrid">
          <div className="AttendanceFormField">
            <label>Employee:</label>
            <select
              name="employeeId"
              value={form.employee.employeeId}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Employee --</option>
              {employees.map((emp) => (
                <option key={emp.employeeId} value={emp.employeeId}>
                  {emp.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="AttendanceFormField">
            <label>Date:</label>
            <input
              type="date"
              name="attendanceDate"
              value={form.attendanceDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="AttendanceFormField">
            <label>Total Hours:</label>
            <input
              type="number"
              step="0.01"
              name="totalHours"
              value={form.totalHours}
              onChange={handleChange}
              placeholder="Total Hours"
              min="0"
            />
          </div>

          <div className="AttendanceFormField">
            <label>Status:</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              required
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
              <option value="OnLeave">OnLeave</option>
            </select>
          </div>
        </div>

        <div className="AttendanceFormButtons">
          <button type="submit" className="AttendanceSaveButton">
            <FaSave style={{ marginRight: 5 }} />
            Save
          </button>
          <button
            type="button"
            className="AttendanceCancelButton"
            onClick={onCancel}
          >
            <FaTimes style={{ marginRight: 5 }} />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AttendanceForm;
