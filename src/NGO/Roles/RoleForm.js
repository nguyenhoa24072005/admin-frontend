import React, { useState, useEffect } from "react";
import { FaSave, FaTimes } from "react-icons/fa";
import "./Role.css";

const RoleForm = ({ editRole, onSave, onCancel }) => {
  const [form, setForm] = useState({
    roleName: "",
    description: "",
  });

  useEffect(() => {
    if (editRole) {
      setForm({
        roleName: editRole.roleName || "",
        description: editRole.description || "",
      });
    }
  }, [editRole]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <>
      <div className="RoleOverlay" onClick={onCancel} />
      <div className="RoleModal">
        <form className="RoleForm" onSubmit={handleSubmit}>
          <h3>{editRole ? "Edit Role" : "Add Role"}</h3>

          <div className="RoleFormField">
            <label>Role Name:</label>
            <input
              name="roleName"
              value={form.roleName}
              onChange={handleChange}
              placeholder="Role Name"
              required
            />
          </div>

          <div className="RoleFormField">
            <label>Description:</label>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              required
            />
          </div>

          <div className="RoleFormButtons">
            <button type="submit" className="RoleSaveButton">
              <FaSave style={{ marginRight: 5 }} />
              Save
            </button>
            <button
              type="button"
              className="RoleCancelButton"
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

export default RoleForm;
