import React, { useEffect, useState } from "react";
import {
  getWorkSchedules,
  createWorkSchedule,
  updateWorkSchedule,
  deleteWorkSchedule,
} from "../Service/workScheduleService";
import WorkScheduleForm from "./WorkScheduleForm";
import "./WorkSchedule.css";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

const WorkScheduleList = () => {
  const [schedules, setSchedules] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const mapStatus = (status) => {
    // Normalize status for display
    const normalizedStatus = status ? status.toString().toLowerCase() : "";
    if (["active", "true", "1"].includes(normalizedStatus)) {
      return "Active";
    }
    if (["inactive", "false", "0"].includes(normalizedStatus)) {
      return "Inactive";
    }
    return status; // Fallback to original status
  };

  const loadSchedules = async () => {
    try {
      const data = await getWorkSchedules();
      const mappedData = data.data?.result || data; // Handle .data.result if present
      const processedData = mappedData.map((s) => {
        const displayStatus = mapStatus(s.status);
        console.log(
          `Schedule ${s.scheduleId} status: ${s.status}, mapped to: ${displayStatus}`
        ); // Debug log
        return { ...s, displayStatus };
      });
      setSchedules(processedData);
    } catch (err) {
      console.error("Failed to load work schedules:", err);
      alert("Failed to load work schedules");
    }
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  const handleSave = async (form) => {
    try {
      const payload = {
        ...form,
        status:
          form.status === "Active"
            ? "ACTIVE"
            : form.status === "Inactive"
            ? "INACTIVE"
            : form.status,
      };
      if (editData) {
        await updateWorkSchedule(editData.scheduleId, payload);
      } else {
        await createWorkSchedule(payload);
      }
      setShowForm(false);
      setEditData(null);
      loadSchedules();
    } catch (err) {
      console.error("Failed to save work schedule:", err);
      alert("Failed to save schedule");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this schedule?")) {
      try {
        await deleteWorkSchedule(id);
        loadSchedules();
        if (schedules.length <= 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (err) {
        console.error("Failed to delete work schedule:", err);
        alert("Failed to delete schedule");
      }
    }
  };

  // Pagination logic with ellipsis
  const totalPages = Math.ceil(schedules.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSchedules = schedules.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const maxVisiblePages = 5;
  const pageNumbers = [];
  const ellipsis = "...";

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    const startPage = Math.max(2, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);

    pageNumbers.push(1); // Always show first page
    if (startPage > 2) {
      pageNumbers.push(ellipsis);
    }
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    if (endPage < totalPages - 1) {
      pageNumbers.push(ellipsis);
    }
    if (totalPages > 1) {
      pageNumbers.push(totalPages); // Always show last page
    }
  }

  return (
    <div className="WorkScheduleContainer">
      <h2>Work Schedule List</h2>

      <div className="WorkScheduleControls">
        <button
          className="WorkScheduleAddButton"
          onClick={() => {
            setEditData(null);
            setShowForm(true);
          }}
        >
          <FaPlus style={{ marginRight: 6 }} />
          Add
        </button>
      </div>

      {showForm && (
        <>
          <div
            className="WorkScheduleOverlay"
            onClick={() => setShowForm(false)}
          />
          <WorkScheduleForm
            editData={editData}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditData(null);
            }}
          />
        </>
      )}

      <table className="WorkScheduleTable">
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
          {currentSchedules.length > 0 ? (
            currentSchedules.map((s) => (
              <tr key={s.scheduleId}>
                <td>{s.scheduleId}</td>
                <td>{s.employeeName || "N/A"}</td>
                <td>{s.scheduleInfoName || "N/A"}</td>
                <td>{new Date(s.workDay).toLocaleDateString()}</td>
                <td>
                  {new Date(`1970-01-01T${s.startTime}`).toLocaleTimeString(
                    [],
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </td>
                <td>
                  {new Date(`1970-01-01T${s.endTime}`).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className={`WorkScheduleStatus ${s.displayStatus}`}>
                  {s.displayStatus}
                </td>
                <td>
                  <button
                    className="WorkScheduleEditButton"
                    onClick={() => {
                      setEditData(s);
                      setShowForm(true);
                    }}
                  >
                    <FaEdit style={{ marginRight: 4 }} />
                    Edit
                  </button>
                  <button
                    className="WorkScheduleDeleteButton"
                    onClick={() => handleDelete(s.scheduleId)}
                  >
                    <FaTrash style={{ marginRight: 4 }} />
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="PaginationControls">
          <button
            className="PaginationButton"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FaArrowLeft style={{ marginRight: 6 }} />
            Previous
          </button>
          <div className="PaginationNumbers">
            {pageNumbers.map((page, index) =>
              page === ellipsis ? (
                <span key={`ellipsis-${index}`} className="PaginationEllipsis">
                  {ellipsis}
                </span>
              ) : (
                <button
                  key={page}
                  className={`PaginationNumber ${
                    currentPage === page ? "active" : ""
                  }`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              )
            )}
          </div>
          <button
            className="PaginationButton"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <FaArrowRight style={{ marginLeft: 6 }} />
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkScheduleList;
