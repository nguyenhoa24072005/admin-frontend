import React, { useState, useEffect } from "react";
import {
  addDepartment,
  updateDepartment,
} from "../Service/departmentService";
import { FaSave, FaTimes } from "react-icons/fa";
import "./Department.css";

const DepartmentForm = ({ editDepartment, onSave, onCancel }) => {
  const [departmentName, setDepartmentName] = useState("");

  /* Prefill when edit */
  useEffect(() => {
    if (editDepartment) {
      setDepartmentName(editDepartment.departmentName);
    }
  }, [editDepartment]);

  /* Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { departmentName };

    try {
      if (editDepartment) {
        await updateDepartment(editDepartment.departmentId, payload);
      } else {
        await addDepartment(payload);
      }
      onSave();
      setDepartmentName("");
    } catch {
      alert("Failed to save department");
    }
  };

  return (
    <>
      {/* Overlay click = cancel */}
      <div className="DepartmentOverlay" onClick={onCancel} />

      <div className="DepartmentModal">
        <form className="DepartmentForm" onSubmit={handleSubmit}>
          <label>Department Name:</label>
          <input
            type="text"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
            required
          />

          <div className="DepartmentFormButtons">
            <button type="submit" className="DepartmentSaveButton">
              <FaSave style={{ marginRight: 5 }} />
              Save
            </button>

            <button
              type="button"
              className="DepartmentCancelButton"
              onClick={onCancel}
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

export default DepartmentForm;
