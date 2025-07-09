import React, { useState, useEffect } from "react";
import { addPosition, updatePosition } from "../Service/positionService";
import { FaSave, FaTimes } from "react-icons/fa";
import "./Position.css";

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
    <>
      <div className="PositionOverlay" onClick={onCancel} />
      <div className="PositionModal">
        <form className="PositionForm" onSubmit={handleSubmit}>
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

          <div className="PositionFormButtons">
            <button type="submit" className="PositionSaveButton">
              <FaSave style={{ marginRight: 5 }} />
              Save
            </button>
            <button
              type="button"
              className="PositionCancelButton"
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

export default PositionForm;
