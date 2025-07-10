import React, { useEffect, useState } from "react";
import {
  getAllAppeals,
  updateAppealStatus,
} from "../Service/attendanceAppealService";
import { FaEdit, FaCheck, FaTimes, FaSearch } from "react-icons/fa";
import "./AdminAppealList.css";

const AdminAppealList = () => {
  const [appeals, setAppeals] = useState([]);
  const [filteredAppeals, setFilteredAppeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAppeal, setEditingAppeal] = useState(null);
  const [statusForm, setStatusForm] = useState({ status: "", note: "" });
  const [filters, setFilters] = useState({
    employee: "",
    appealDate: "",
    reason: "",
    status: "",
  });

  const loadAllAppeals = async () => {
    try {
      setLoading(true);
      const data = await getAllAppeals();
      setAppeals(data);
      setFilteredAppeals(data);
    } catch (err) {
      alert("Failed to load appeals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllAppeals();
  }, []);

  useEffect(() => {
    const filtered = appeals.filter((a) => {
      const matchesEmployee = a.employee?.fullName
        .toLowerCase()
        .includes(filters.employee.toLowerCase());
      const matchesDate = filters.appealDate
        ? new Date(a.appealDate).toISOString().split("T")[0] ===
          filters.appealDate
        : true;
      const matchesReason = a.reason
        .toLowerCase()
        .includes(filters.reason.toLowerCase());
      const matchesStatus = filters.status ? a.status === filters.status : true;
      return matchesEmployee && matchesDate && matchesReason && matchesStatus;
    });
    setFilteredAppeals(filtered);
  }, [filters, appeals]);

  const handleEditClick = (appeal) => {
    setEditingAppeal(appeal);
    setStatusForm({ status: "Approved", note: "" });
  };

  const handleStatusChange = (e) => {
    setStatusForm((prev) => ({ ...prev, status: e.target.value }));
  };

  const handleNoteChange = (e) => {
    setStatusForm((prev) => ({ ...prev, note: e.target.value }));
  };

  const handleSubmitStatus = async () => {
    try {
      await updateAppealStatus(editingAppeal.appealId, {
        status: statusForm.status,
        reviewedBy: localStorage.getItem("userId"),
        note: statusForm.note,
      });
      setEditingAppeal(null);
      loadAllAppeals();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString();
  };

  const getEvidenceImageSrc = (evidence) => {
    if (!evidence) return null;
    if (evidence.startsWith("/9j")) {
      return `data:image/jpeg;base64,${evidence}`;
    }
    if (evidence.startsWith("http")) {
      return evidence;
    }
    return null;
  };

  return (
    <div className="AdminContainer">
      <h2>All Attendance Appeals</h2>

      <div className="FilterBar">
        <input
          type="text"
          name="employee"
          value={filters.employee}
          onChange={handleFilterChange}
          placeholder="Search Employee"
        />
        <input
          type="date"
          name="appealDate"
          value={filters.appealDate}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="reason"
          value={filters.reason}
          onChange={handleFilterChange}
          placeholder="Search Reason"
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filteredAppeals.length === 0 ? (
        <p>No appeals found.</p>
      ) : (
        <table className="AdminTable">
          <thead>
            <tr>
              <th>Appeal ID</th>
              <th>Employee</th>
              <th>Image</th>
              <th>Appeal Date</th>
              <th>Reason</th>
              <th>Evidence</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppeals.map((a) => (
              <tr key={a.appealId}>
                <td>{a.appealId}</td>
                <td>{a.employee?.fullName}</td>
                <td>
                  <img
                    src={`http://localhost:8080/${a.employee?.img}`}
                    alt="Employee"
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                </td>
                <td>{formatDate(a.appealDate)}</td>
                <td>{a.reason}</td>
                <td>
                  {getEvidenceImageSrc(a.evidence) ? (
                    <img
                      src={getEvidenceImageSrc(a.evidence)}
                      alt="Evidence"
                      style={{ maxWidth: 80, maxHeight: 80, borderRadius: 6 }}
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td className={`StatusBadge ${a.status}`}>{a.status}</td>
                <td>
                  {a.status === "Pending" ? (
                    <button
                      className="EditButton"
                      onClick={() => handleEditClick(a)}
                    >
                      <FaEdit />
                    </button>
                  ) : (
                    <>
                      <div>{a.reviewedBy?.fullName || "-"}</div>
                      <div>{formatDate(a.reviewedAt)}</div>
                      <div>{a.note || "-"}</div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editingAppeal && (
        <>
          <div
            className="ModalOverlay"
            onClick={() => setEditingAppeal(null)}
          />
          <div className="ModalBox">
            <h3>Review Appeal</h3>
            <p>
              <strong>Employee:</strong> {editingAppeal.employee?.fullName}
            </p>
            <label>Status:</label>
            <select value={statusForm.status} onChange={handleStatusChange}>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <label>Note:</label>
            <textarea
              value={statusForm.note}
              onChange={handleNoteChange}
              placeholder="Enter your reason"
            />
            <div className="ModalButtons">
              <button className="SaveButton" onClick={handleSubmitStatus}>
                <FaCheck /> Save
              </button>
              <button
                className="CancelButton"
                onClick={() => setEditingAppeal(null)}
              >
                <FaTimes /> Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminAppealList;
