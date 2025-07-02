// src/Components/DepartmentForm.js
import React, { useState, useEffect } from "react";
import {
  addDepartment,
  updateDepartment,
} from "../Service/departmentService";

const DepartmentForm = ({ editDepartment, onSave, onCancel }) => {
  const [departmentName, setDepartmentName] = useState("");

  useEffect(() => {
    if (editDepartment) {
      setDepartmentName(editDepartment.departmentName);
    }
  }, [editDepartment]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { departmentName };

    try {
      if (editDepartment) {
        await updateDepartment(editDepartment.departmentId, data);
      } else {
        await addDepartment(data);
      }
      onSave(); // reload lại danh sách
      setDepartmentName("");
    } catch (error) {
      alert("Failed to save department");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Department Name:</label>
      <input
        type="text"
        value={departmentName}
        onChange={(e) => setDepartmentName(e.target.value)}
        required
      />
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default DepartmentForm;
