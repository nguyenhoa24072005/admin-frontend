import React, { useEffect, useState } from "react";
import {
  getWorkSchedules,
  createWorkSchedule,
  updateWorkSchedule,
  deleteWorkSchedule,
} from "../Service/workScheduleService";
import WorkScheduleForm from "./WorkScheduleForm";

const WorkScheduleList = () => {
  const [schedules, setSchedules] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const loadSchedules = async () => {
    try {
      const data = await getWorkSchedules(); // ✅ Phải trả về .data.result từ service
      setSchedules(data);
    } catch (err) {
      alert("Failed to load work schedules");
    }
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  const handleSave = async (form) => {
    try {
      if (editData) {
        await updateWorkSchedule(editData.scheduleId, form);
      } else {
        await createWorkSchedule(form);
      }
      setShowForm(false);
      setEditData(null);
      loadSchedules();
    } catch {
      alert("Failed to save schedule");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this schedule?")) {
      try {
        await deleteWorkSchedule(id);
        loadSchedules();
      } catch {
        alert("Failed to delete schedule");
      }
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Work Schedule List</h2>

      <button
        onClick={() => {
          setEditData(null);
          setShowForm(true);
        }}
        style={{ marginBottom: 10 }}
      >
        + Add
      </button>

      {showForm && (
        <WorkScheduleForm
          editData={editData}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditData(null);
          }}
        />
      )}

      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Employee Name</th>
            <th>Schedule Info</th>
            <th>Work Day</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {schedules.length > 0 ? (
            schedules.map((s) => (
              <tr key={s.scheduleId}>
                <td>{s.scheduleId}</td>
                <td>{s.employeeName || "N/A"}</td>
                <td>{s.scheduleInfoName || "N/A"}</td>
                <td>{new Date(s.workDay).toLocaleDateString()}</td>
                <td>
                  {new Date(`1970-01-01T${s.startTime}`).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td>
                  {new Date(`1970-01-01T${s.endTime}`).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td>{s.status}</td>
                <td>
                  <button onClick={() => { setEditData(s); setShowForm(true); }}>Edit</button>
                  <button onClick={() => handleDelete(s.scheduleId)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>No data available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WorkScheduleList;
