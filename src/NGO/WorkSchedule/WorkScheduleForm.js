import React, { useState, useEffect } from "react";
import { getEmployees } from "../Service/employeeService";
import { getWorkScheduleInfos } from "../Service/workScheduleInfoService";
import "./WorkSchedule.css";
import { FaSave, FaTimes, FaPlus } from "react-icons/fa";

const WorkScheduleForm = ({ editData, onSave, onCancel }) => {
  const [form, setForm] = useState({
    employeeId: "",
    scheduleInfoId: "",
    workDay: "",
    startTime: "",
    endTime: "",
    status: "Active",
    isOvertime: false,
  });
  const [bulkSchedules, setBulkSchedules] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [scheduleInfos, setScheduleInfos] = useState([]);
  const [isBulkMode, setIsBulkMode] = useState(false);

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
        isOvertime: editData.isOvertime || false,
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleBulkAdd = () => {
    setBulkSchedules([...bulkSchedules, { ...form }]);
    setForm({
      employeeId: "",
      scheduleInfoId: "",
      workDay: "",
      startTime: "",
      endTime: "",
      status: "Active",
      isOvertime: false,
    });
  };

  const handleBulkRemove = (index) => {
    setBulkSchedules(bulkSchedules.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const basePayload = {
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

    if (isBulkMode) {
      const payloads = [
        ...bulkSchedules,
        basePayload,
      ].map((schedule) => ({
        ...schedule,
        status: schedule.isOvertime ? "PENDING" : schedule.status,
      }));
      onSave(payloads, true);
      setBulkSchedules([]);
    } else {
      onSave({
        ...basePayload,
        status: form.isOvertime ? "PENDING" : form.status,
      });
    }
  };

  return (
    <div className="WorkScheduleModal">
      <form className="WorkScheduleForm" onSubmit={handleSubmit}>
        <h3>{editData ? "Edit" : isBulkMode ? "Add Bulk" : "Add"} Work Schedule</h3>

        {!editData && (
          <div className="WorkScheduleFormField">
            <label>
              <input
                type="checkbox"
                checked={isBulkMode}
                onChange={(e) => setIsBulkMode(e.target.checked)}
              />
              Bulk Mode
            </label>
          </div>
        )}

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
              disabled={form.isOvertime}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="WorkScheduleFormField">
            <label>
              <input
                type="checkbox"
                name="isOvertime"
                checked={form.isOvertime}
                onChange={handleChange}
              />
              Overtime
            </label>
          </div>
        </div>

        {isBulkMode && !editData && (
          <div className="WorkScheduleBulkSection">
            <button
              type="button"
              className="WorkScheduleAddBulkButton"
              onClick={handleBulkAdd}
              disabled={!form.employeeId || !form.scheduleInfoId || !form.workDay}
            >
              <FaPlus style={{ marginRight: 5 }} />
              Add to Bulk
            </button>
            {bulkSchedules.length > 0 && (
              <div className="WorkScheduleBulkList">
                <h4>Bulk Schedules ({bulkSchedules.length})</h4>
                <ul>
                  {bulkSchedules.map((schedule, index) => (
                    <li key={index}>
                      {schedule.employeeId} - {schedule.workDay} -{" "}
                      {schedule.startTime} to {schedule.endTime}
                      <button
                        type="button"
                        className="WorkScheduleRemoveBulkButton"
                        onClick={() => handleBulkRemove(index)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

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