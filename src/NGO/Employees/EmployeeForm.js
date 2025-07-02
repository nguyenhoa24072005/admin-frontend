import React, { useEffect, useState } from "react";
import {
  addEmployee,
  updateEmployee,
} from "../Service/employeeService";
import { getDepartments } from "../Service/departmentService";
import { getPositions } from "../Service/positionService";

const EmployeeForm = ({ editEmployee, onSave, onCancel }) => {
  const [form, setForm] = useState({
    fullName: "",
    gender: "Male",
    dateOfBirth: "",
    phone: "",
    address: "",
    img: "",
    departmentId: "",
    positionId: "",
    hireDate: "",
  });

  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const dept = await getDepartments("Active");
      const pos = await getPositions("Active");
      setDepartments(dept.sort((a, b) => a.departmentName.localeCompare(b.departmentName)));
      setPositions(pos.sort((a, b) => a.positionName.localeCompare(b.positionName)));
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (editEmployee) {
      setForm({
        fullName: editEmployee.fullName || "",
        gender: editEmployee.gender || "Male",
        dateOfBirth: editEmployee.dateOfBirth || "",
        phone: editEmployee.phone || "",
        address: editEmployee.address || "",
        img: editEmployee.img || "",
        departmentId: editEmployee.departmentId || "",
        positionId: editEmployee.positionId || "",
        hireDate: "", // khi edit thì không cần gửi lên
      });
    }
  }, [editEmployee]);

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
      const payload = { ...form };
      if (editEmployee) {
        delete payload.hireDate; // Không gửi hireDate khi cập nhật
        await updateEmployee(editEmployee.employeeId, payload);
      } else {
        await addEmployee(payload);
      }
      onSave();
    } catch (err) {
      alert("Failed to save employee");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{editEmployee ? "Edit Employee" : "Add Employee"}</h3>

      <input
        name="fullName"
        value={form.fullName}
        onChange={handleChange}
        placeholder="Full Name"
        required
      />

      <select name="gender" value={form.gender} onChange={handleChange}>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>

      <input
        name="dateOfBirth"
        type="date"
        value={form.dateOfBirth}
        onChange={handleChange}
        required
      />

      <input
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="Phone"
        required
      />

      <input
        name="address"
        value={form.address}
        onChange={handleChange}
        placeholder="Address"
        required
      />

      <input
        name="img"
        value={form.img}
        onChange={handleChange}
        placeholder="Image URL"
      />

      <select
        name="departmentId"
        value={form.departmentId}
        onChange={handleChange}
        required
      >
        <option value="">-- Select Department --</option>
        {departments.map((d) => (
          <option key={d.departmentId} value={d.departmentId}>
            {d.departmentName}
          </option>
        ))}
      </select>

      <select
        name="positionId"
        value={form.positionId}
        onChange={handleChange}
        required
      >
        <option value="">-- Select Position --</option>
        {positions.map((p) => (
          <option key={p.positionId} value={p.positionId}>
            {p.positionName}
          </option>
        ))}
      </select>

      {/* Chỉ hiện trường hireDate khi thêm mới */}
      {!editEmployee && (
        <input
          name="hireDate"
          type="date"
          value={form.hireDate}
          onChange={handleChange}
          required
        />
      )}

      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default EmployeeForm;
