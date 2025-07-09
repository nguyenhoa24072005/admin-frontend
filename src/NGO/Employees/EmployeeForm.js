import React, { useEffect, useState } from "react";
import { addEmployee, updateEmployee } from "../Service/employeeService";
import { getDepartments } from "../Service/departmentService";
import { getPositions } from "../Service/positionService";
import { FaSave, FaTimes } from "react-icons/fa";
import "./Employee.css";

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
      setDepartments(
        dept.sort((a, b) => a.departmentName.localeCompare(b.departmentName))
      );
      setPositions(
        pos.sort((a, b) => a.positionName.localeCompare(b.positionName))
      );
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
        hireDate: "",
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
        delete payload.hireDate;
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
    <>
      <div className="EmployeeOverlay" onClick={onCancel} />
      <div className="EmployeeModal">
        <form className="EmployeeForm" onSubmit={handleSubmit}>
          <h3>{editEmployee ? "Edit Employee" : "Add Employee"}</h3>

          <div className="EmployeeFormGrid">
            <div className="EmployeeFormField">
              <label>Full Name:</label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                required
              />
            </div>

            <div className="EmployeeFormField">
              <label>Gender:</label>
              <select name="gender" value={form.gender} onChange={handleChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="EmployeeFormField">
              <label>Date of Birth:</label>
              <input
                name="dateOfBirth"
                type="date"
                value={form.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>

            <div className="EmployeeFormField">
              <label>Phone:</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone"
                required
              />
            </div>

            <div className="EmployeeFormField">
              <label>Address:</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Address"
                required
              />
            </div>

            <div className="EmployeeFormField">
              <label>Image URL:</label>
              <input
                name="img"
                value={form.img}
                onChange={handleChange}
                placeholder="Image URL"
              />
            </div>

            <div className="EmployeeFormField">
              <label>Department:</label>
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
            </div>

            <div className="EmployeeFormField">
              <label>Position:</label>
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
            </div>

            {!editEmployee && (
              <div className="EmployeeFormField">
                <label>Hire Date:</label>
                <input
                  name="hireDate"
                  type="date"
                  value={form.hireDate}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
          </div>

          <div className="EmployeeFormButtons">
            <button type="submit" className="EmployeeSaveButton">
              <FaSave style={{ marginRight: 5 }} />
              Save
            </button>
            <button
              type="button"
              className="EmployeeCancelButton"
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

export default EmployeeForm;
