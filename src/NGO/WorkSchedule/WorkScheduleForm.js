import React, { useState, useEffect } from "react";
import { getEmployees } from "../Service/employeeService";
import { getWorkScheduleInfos } from "../Service/workScheduleInfoService";
import "./WorkSchedule.css";
import { FaSave, FaTimes } from "react-icons/fa";

const WorkScheduleForm = ({ editData, onSave, onCancel }) => {
  const [form, setForm] = useState({
    employeeId: "",
    scheduleInfoId: "",
    workDay: "",
    startTime: "",
    endTime: "",
    status: "Active",
  });
  const [employees, setEmployees] = useState([]);
  const [scheduleInfos, setScheduleInfos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const empData = await getEmployees("Active");
        setEmployees(
          empData.sort((a, b) => a.fullName.localeCompare(b.fullName))
        );
        const infoData = await getWorkScheduleInfos();
        setScheduleInfos(infoData.data?.result || infoData);
      } catch (err) {
        console.error("Failed to fetch dropdown data:", err);
        alert("Failed to fetch employees or schedule infos.");
      }
    };
    fetchData();

    if (editData) {
      setForm({
        employeeId: editData.employeeId || "",
        scheduleInfoId: editData.scheduleInfoId || "",
        workDay: editData.workDay?.split("T")[0] || "",
        startTime: editData.startTime
          ? new Date(editData.startTime).toISOString().slice(11, 16)
          : "",
        endTime: editData.endTime
          ? new Date(editData.endTime).toISOString().slice(11, 16)
          : "",
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
      workDay: form.workDay
        ? new Date(form.workDay).toISOString().split("T")[0]
        : "",
      startTime:
        form.workDay && form.startTime
          ? `${form.workDay}T${form.startTime}:00Z`
          : "",
      endTime:
        form.workDay && form.endTime
          ? `${form.workDay}T${form.endTime}:00Z`
          : "",
    };
    onSave(payload);
  };

  return (
    <div className="WorkScheduleModal">
      <form className="WorkScheduleForm" onSubmit={handleSubmit}>
        <h3>{editData ? "Edit" : "Add"} Work Schedule</h3>

        <div className="WorkScheduleFormGrid">
          <div className="WorkScheduleFormField">
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

          <div className="WorkScheduleFormField">
            <label>Schedule Info:</label>
            <select
              name="scheduleInfoId"
              value={form.scheduleInfoId}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Schedule Info --</option>
              {scheduleInfos.map((info) => (
                <option key={info.scheduleInfoId} value={info.scheduleInfoId}>
                  {info.name}
                </option>
              ))}
            </select>
          </div>

          <div className="WorkScheduleFormField">
            <label>Work Day:</label>
            <input
              type="date"
              name="workDay"
              value={form.workDay}
              onChange={handleChange}
              required
            />
          </div>

          <div className="WorkScheduleFormField">
            <label>Start Time:</label>
            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="WorkScheduleFormField">
            <label>End Time:</label>
            <input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="WorkScheduleFormField">
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

        <div className="WorkScheduleFormButtons">
          <button type="submit" className="WorkScheduleSaveButton">
            <FaSave style={{ marginRight: 5 }} />
            Save
          </button>
          <button
            type="button"
            className="WorkScheduleCancelButton"
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

export default WorkScheduleForm;
