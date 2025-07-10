// src/Components/AttendanceAppealForm.js
import React, { useState } from "react";
import { createAppeal } from "../Service/attendanceAppealService";
import { FaSave, FaTimes } from "react-icons/fa";

const AttendanceAppealForm = ({ employeeId, onClose, onSaved }) => {
  const [form, setForm] = useState({
    attendanceId: "",
    reason: "",
    evidence: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createAppeal({ employeeId, ...form });
    onSaved(); // reload list
    onClose(); // close modal
  };

  return (
    <>
      <div className="UserOverlay" onClick={onClose} />
      <div className="UserModal">
        <form className="UserForm" onSubmit={handleSubmit}>
          <h3>New Attendance Appeal</h3>
          <div className="UserFormGrid">
            <div className="UserFormField">
              <label>Attendance ID:</label>
              <input
                name="attendanceId"
                value={form.attendanceId}
                onChange={handleChange}
                placeholder="Attendance ID"
                required
              />
            </div>
            <div className="UserFormField">
              <label>Reason:</label>
              <textarea
                name="reason"
                value={form.reason}
                onChange={handleChange}
                placeholder="Explain your reason"
                required
              />
            </div>
            <div className="UserFormField">
              <label>Evidence (optional):</label>
              <textarea
                name="evidence"
                value={form.evidence}
                onChange={handleChange}
                placeholder="Link or explanation"
              />
            </div>
          </div>
          <div className="UserFormButtons">
            <button type="submit" className="UserSaveButton">
              <FaSave style={{ marginRight: 5 }} />
              Submit
            </button>
            <button
              type="button"
              className="UserCancelButton"
              onClick={onClose}
            >
              <FaTimes style={{ marginRight: 5 }} />
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AttendanceAppealForm;
