import React, { useState, useEffect } from "react";
import { getEmployees } from "../Service/employeeService";
import "./Leave.css";
import { FaSave, FaTimes } from "react-icons/fa";

const LeaveForm = ({ onSave, onCancel, editLeave }) => {
  const [form, setForm] = useState({
    employeeId: "",
    leaveStartDate: "",
    leaveEndDate: "",
    leaveType: "",
    status: "PENDING",
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

    if (editLeave) {
      setForm({
        employeeId: editLeave.employeeId || "",
        leaveStartDate: editLeave.leaveStartDate?.slice(0, 10) || "",
        leaveEndDate: editLeave.leaveEndDate?.slice(0, 10) || "",
        leaveType: editLeave.leaveType || "",
        status: editLeave.status || "PENDING",
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
    <div className="LeaveModal">
      <form className="LeaveForm" onSubmit={handleSubmit}>
        <h3>{editLeave ? "Edit Leave Request" : "New Leave Request"}</h3>

        <div className="LeaveFormGrid">
          <div className="LeaveFormField">
            <label>Employee:</label>
            <select
              name="employeeId"
              value={form.employeeId}
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

          <div className="LeaveFormField">
            <label>Start Date:</label>
            <input
              type="date"
              name="leaveStartDate"
              value={form.leaveStartDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="LeaveFormField">
            <label>End Date:</label>
            <input
              type="date"
              name="leaveEndDate"
              value={form.leaveEndDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="LeaveFormField">
            <label>Leave Type:</label>
            <input
              name="leaveType"
              value={form.leaveType}
              onChange={handleChange}
              placeholder="e.g., Sick, Vacation"
              required
            />
          </div>

          <div className="LeaveFormField">
            <label>Status:</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              required
            >
              <option value="APPROVED">Approved</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        <div className="LeaveFormButtons">
          <button type="submit" className="LeaveSaveButton">
            <FaSave style={{ marginRight: 5 }} />
            Save
          </button>
          <button
            type="button"
            className="LeaveCancelButton"
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

export default LeaveForm;
