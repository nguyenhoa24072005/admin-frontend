import React, { useEffect, useState } from "react";
import {
  getAttendances,
  createAttendance,
  updateAttendance,
  deleteAttendance,
} from "../Service/AttendanceService";
import AttendanceForm from "./AttendanceForm";

const AttendanceList = () => {
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadData = async () => {
    try {
      const res = await getAttendances();
      setData(res);
    } catch (err) {
      alert("Failed to load attendance data.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await deleteAttendance(id);
      loadData();
    }
  };

  const handleSave = async (form) => {
    try {
      if (editData) {
        await updateAttendance(editData.attendanceId, form);
      } else {
        await createAttendance(form);
      }
      setShowForm(false);
      loadData();
    } catch {
      alert("Failed to save attendance");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Attendance List</h2>

      <button
        onClick={() => {
          setEditData(null);
          setShowForm(true);
        }}
      >
        + Add Attendance
      </button>

      {showForm && (
        <AttendanceForm
          editData={editData}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}

      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%", marginTop: 10 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>EmployeeId</th>
            <th>EmployeeName</th>
            <th>Date</th>
            <th>Total Hours</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((att) => (
              <tr key={att.attendanceId}>
                <td>{att.attendanceId}</td>
                <td>{att.employee?.employeeId}</td>
                <td>{att.employee?.fullName}</td>
                <td>{att.attendanceDate?.slice(0, 10)}</td>
                <td>{att.totalHours}</td>
                <td>{att.status}</td>
                <td>
                  <button
                    onClick={() => {
                      setEditData(att);
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDelete(att.attendanceId)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceList;
