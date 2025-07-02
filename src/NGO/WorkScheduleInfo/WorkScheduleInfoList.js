import React, { useEffect, useState } from "react";
import {
  getWorkScheduleInfos,
  createWorkScheduleInfo,
  updateWorkScheduleInfo,
  deleteWorkScheduleInfo,
} from "../Service/workScheduleInfoService";
import WorkScheduleInfoForm from "./WorkScheduleInfoForm";

const WorkScheduleInfoList = () => {
  const [infos, setInfos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const loadInfos = async () => {
    try {
      const data = await getWorkScheduleInfos();
      setInfos(data);
    } catch (err) {
      alert("Failed to load data");
    }
  };

  useEffect(() => {
    loadInfos();
  }, []);

  const handleSave = async (form) => {
    try {
      if (editData) {
        await updateWorkScheduleInfo(editData.scheduleInfoId, form);
      } else {
        await createWorkScheduleInfo(form);
      }
      setShowForm(false);
      loadInfos();
    } catch (err) {
      alert("Failed to save");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete?")) {
      await deleteWorkScheduleInfo(id);
      loadInfos();
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Work Schedule Info List</h2>

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
        <WorkScheduleInfoForm
          editData={editData}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}

      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {infos.length > 0 ? (
            infos.map((info) => (
              <tr key={info.scheduleInfoId}>
                <td>{info.scheduleInfoId}</td>
                <td>{info.name}</td>
                <td>{info.description}</td>
                <td>{info.defaultStartTime}</td>
                <td>{info.defaultEndTime}</td>
                <td>{info.status}</td>
                <td>
                  <button
                    onClick={() => {
                      setEditData(info);
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDelete(info.scheduleInfoId)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WorkScheduleInfoList;
