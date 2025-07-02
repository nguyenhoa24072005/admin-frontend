import React, { useState, useEffect } from "react";

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
    <form onSubmit={handleSubmit}>
      <h3>{editData ? "Edit" : "Add"} Work Schedule Info</h3>

      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Name"
        required
      />

      <input
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
      />

      <input
        type="time"
        name="defaultStartTime"
        value={form.defaultStartTime}
        onChange={handleChange}
        required
      />

      <input
        type="time"
        name="defaultEndTime"
        value={form.defaultEndTime}
        onChange={handleChange}
        required
      />

      <select name="status" value={form.status} onChange={handleChange} required>
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

export default WorkScheduleInfoForm;
