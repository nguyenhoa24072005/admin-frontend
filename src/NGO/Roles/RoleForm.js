import React, { useEffect, useState } from "react";
import { addRole, updateRole } from "../Service/RoleService";

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
    try {
      if (editRole) {
        await updateRole(editRole.roleId, form);
      } else {
        await addRole(form);
      }
      onSave();
    } catch (error) {
      alert("Failed to save role");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{editRole ? "Edit Role" : "Add Role"}</h3>

      <input
        name="roleName"
        value={form.roleName}
        onChange={handleChange}
        placeholder="Role Name"
        required
      />

      <input
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        required
      />

      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default RoleForm;
