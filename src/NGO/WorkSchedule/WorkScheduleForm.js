import React, { useState, useEffect } from "react";

const WorkScheduleForm = ({ editData, onSave, onCancel }) => {
  const [form, setForm] = useState({
    employeeId: "",
    scheduleInfoId: "",
    workDay: "",
    startTime: "",
    endTime: "",
    status: "Active",
  });

  useEffect(() => {
    if (editData) {
      setForm({
        employeeId: editData.employeeId || "",
        scheduleInfoId: editData.scheduleInfoId || "",
        workDay: editData.workDay?.split("T")[0] || "",
        startTime: editData.startTime ? new Date(editData.startTime).toISOString().slice(11, 16) : "",
        endTime: editData.endTime ? new Date(editData.endTime).toISOString().slice(11, 16) : "",
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

    const payload = {
      ...form,
      workDay: new Date(form.workDay),
      startTime: new Date(`${form.workDay}T${form.startTime}`),
      endTime: new Date(`${form.workDay}T${form.endTime}`),
    };

    onSave(payload);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{editData ? "Edit" : "Add"} Work Schedule</h3>

      <input
        name="employeeId"
        value={form.employeeId}
        onChange={handleChange}
        placeholder="Employee ID"
        required
      />

      <input
        name="scheduleInfoId"
        value={form.scheduleInfoId}
        onChange={handleChange}
        placeholder="Schedule Info ID"
        required
      />

      <input
        type="date"
        name="workDay"
        value={form.workDay}
        onChange={handleChange}
        required
      />

      <input
        type="time"
        name="startTime"
        value={form.startTime}
        onChange={handleChange}
        required
      />

      <input
        type="time"
        name="endTime"
        value={form.endTime}
        onChange={handleChange}
        required
      />

      <select name="status" value={form.status} onChange={handleChange}>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>

      <div style={{ marginTop: 10 }}>
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel} style={{ marginLeft: 10 }}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default WorkScheduleForm;
