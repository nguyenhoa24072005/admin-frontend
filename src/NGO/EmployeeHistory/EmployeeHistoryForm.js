import React, { useEffect, useState } from "react";
import {
  createHistory,
  updateHistory,
} from "../Service/EmployeeHistoryService";
import { getEmployees } from "../Service/employeeService";
import { getDepartments } from "../Service/departmentService";
import { getPositions } from "../Service/positionService";
import { FaSave, FaTimes } from "react-icons/fa";
import "./EmployeeHistory.css";

const EmployeeHistoryForm = ({ editingHistory, onClose }) => {
  const [form, setForm] = useState({
    employeeId: "",
    departmentId: "",
    positionId: "",
    startDate: "",
    endDate: "",
    reason: "",
    status: "Active",
  });
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const empData = await getEmployees("Active");
        const deptData = await getDepartments("Active");
        const posData = await getPositions("Active");
        setEmployees(
          empData.sort((a, b) => a.fullName.localeCompare(b.fullName))
        );
        setDepartments(
          deptData.sort((a, b) =>
            a.departmentName.localeCompare(b.departmentName)
          )
        );
        setPositions(
          posData.sort((a, b) => a.positionName.localeCompare(b.positionName))
        );
      } catch (err) {
        alert("Failed to load data.");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (editingHistory) {
      setForm({
        employeeId: editingHistory.employeeId || "",
        departmentId: editingHistory.departmentId || "",
        positionId: editingHistory.positionId || "",
        startDate: editingHistory.startDate || "",
        endDate: editingHistory.endDate || "",
        reason: editingHistory.reason || "",
        status: editingHistory.status === "WORKING" ? "Active" : "Inactive",
      });
    }
  }, [editingHistory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        status: form.status === "Active" ? "WORKING" : "RESIGNED",
      };
      if (editingHistory) {
        await updateHistory(editingHistory.historyId, payload);
      } else {
        await createHistory(payload);
      }
      onClose();
    } catch (err) {
      alert("Failed to save history.");
    }
  };

  return (
    <>
      <div className="EmployeeHistoryOverlay" onClick={onClose} />
      <div className="EmployeeHistoryModal">
        <form className="EmployeeHistoryForm" onSubmit={handleSubmit}>
          <h3>
            {editingHistory ? "Edit Employee History" : "Add Employee History"}
          </h3>

          <div className="EmployeeHistoryFormGrid">
            <div className="EmployeeHistoryFormField">
              <label>Employee:</label>
              <select
                name="employeeId"
                value={form.employeeId}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Employee --</option>
                {employees.map((emp) => (
                  <option key={emp.employeeId} value={emp.employeeId}>
                    {emp.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div className="EmployeeHistoryFormField">
              <label>Department:</label>
              <select
                name="departmentId"
                value={form.departmentId}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Department --</option>
                {departments.map((dept) => (
                  <option key={dept.departmentId} value={dept.departmentId}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>
            </div>

            <div className="EmployeeHistoryFormField">
              <label>Position:</label>
              <select
                name="positionId"
                value={form.positionId}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Position --</option>
                {positions.map((pos) => (
                  <option key={pos.positionId} value={pos.positionId}>
                    {pos.positionName}
                  </option>
                ))}
              </select>
            </div>

            <div className="EmployeeHistoryFormField">
              <label>Start Date:</label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="EmployeeHistoryFormField">
              <label>End Date:</label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
              />
            </div>

            <div className="EmployeeHistoryFormField">
              <label>Reason:</label>
              <input
                name="reason"
                value={form.reason}
                onChange={handleChange}
                placeholder="Reason"
              />
            </div>

            <div className="EmployeeHistoryFormField">
              <label>Status:</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="EmployeeHistoryFormButtons">
            <button type="submit" className="EmployeeHistorySaveButton">
              <FaSave style={{ marginRight: 5 }} />
              Save
            </button>
            <button
              type="button"
              className="EmployeeHistoryCancelButton"
              onClick={onClose}
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

export default EmployeeHistoryForm;
