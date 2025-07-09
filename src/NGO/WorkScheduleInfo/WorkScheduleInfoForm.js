import React, { useState, useEffect } from "react";
import "./WorkScheduleInfo.css";
import { FaSave, FaTimes } from "react-icons/fa";

const WorkScheduleInfoForm = ({ editData, onSave, onCancel }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    defaultStartTime: "",
    defaultEndTime: "",
    status: "Active",
  });

  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name || "",
        description: editData.description || "",
        defaultStartTime: editData.defaultStartTime || "",
        defaultEndTime: editData.defaultEndTime || "",
        status: editData.status || "Active",
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="WorkScheduleInfoModal">
      <form className="WorkScheduleInfoForm" onSubmit={handleSubmit}>
        <h3>{editData ? "Edit" : "Add"} Work Schedule Info</h3>

        <div className="WorkScheduleInfoFormGrid">
          <div className="WorkScheduleInfoFormField">
            <label>Name:</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              required
            />
          </div>

          <div className="WorkScheduleInfoFormField">
            <label>Description:</label>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
            />
          </div>

          <div className="WorkScheduleInfoFormField">
            <label>Start Time:</label>
            <input
              type="time"
              name="defaultStartTime"
              value={form.defaultStartTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="WorkScheduleInfoFormField">
            <label>End Time:</label>
            <input
              type="time"
              name="defaultEndTime"
              value={form.defaultEndTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="WorkScheduleInfoFormField">
            <label>Status:</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="WorkScheduleInfoFormButtons">
          <button type="submit" className="WorkScheduleInfoSaveButton">
            <FaSave style={{ marginRight: 5 }} />
            Save
          </button>
          <button
            type="button"
            className="WorkScheduleInfoCancelButton"
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

export default WorkScheduleInfoForm;
