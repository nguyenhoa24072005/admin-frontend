import React, { useState } from "react";

const WorkScheduleInlineForm = ({ schedule, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    workDay: schedule.workDay || "",
    startTime: schedule.startTime?.slice(0, 5) || "",
    endTime: schedule.endTime?.slice(0, 5) || "",
    status: schedule.status || "",
    isOvertime: schedule.isOvertime || false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="ScheduleForm">
      <h3>Edit Schedule</h3>
      <div className="FormField">
        <label htmlFor="workDay">Work Day:</label>
        <input
          type="date"
          id="workDay"
          name="workDay"
          value={formData.workDay}
          onChange={handleChange}
          aria-label="Work day"
          required
        />
      </div>
      <div className="FormField">
        <label htmlFor="startTime">Start Time:</label>
        <input
          type="time"
          id="startTime"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          aria-label="Start time"
          required
        />
      </div>
      <div className="FormField">
        <label htmlFor="endTime">End Time:</label>
        <input
          type="time"
          id="endTime"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
          aria-label="End time"
          required
        />
      </div>
      <div className="FormField">
        <label htmlFor="status">Status:</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          aria-label="Status"
          required
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>

        </select>
      </div>
      <div className="FormField checkbox">
        <label htmlFor="isOvertime">
          Overtime:
          <input
            type="checkbox"
            id="isOvertime"
            name="isOvertime"
            checked={formData.isOvertime}
            onChange={handleChange}
            aria-label="Overtime"
          />
        </label>
      </div>
      <div className="FormButtons">
        <button type="submit" aria-label="Save schedule">
          Save
        </button>
        <button type="button" onClick={onCancel} aria-label="Cancel editing">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default WorkScheduleInlineForm;