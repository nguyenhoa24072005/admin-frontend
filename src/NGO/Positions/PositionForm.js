// src/components/PositionForm.js
import React, { useState, useEffect } from "react";
import {
  addPosition,
  updatePosition,
} from "../Service/positionService";

const PositionForm = ({ editPosition, onSave, onCancel }) => {
  const [positionName, setPositionName] = useState("");
  const [status, setStatus] = useState("Active");

  useEffect(() => {
    if (editPosition) {
      setPositionName(editPosition.positionName);
      setStatus(editPosition.status || "Active");
    }
  }, [editPosition]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { positionName, status };

    try {
      if (editPosition) {
        await updatePosition(editPosition.positionId, data);
      } else {
        await addPosition(data);
      }
      onSave();
      setPositionName("");
      setStatus("Active");
    } catch (error) {
      alert("Failed to save position");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Position Name:</label>
      <input
        type="text"
        value={positionName}
        onChange={(e) => setPositionName(e.target.value)}
        required
      />

      <label>Status:</label>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>

      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default PositionForm;
