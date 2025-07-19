import React, { useEffect, useState } from "react";
import {
  getWorkSchedules,
  createWorkSchedule,
  createBulkWorkSchedules,
  updateWorkSchedule,
  deleteWorkSchedule,
  softDeleteWorkSchedule,
  getSchedulesByEmployeeAndDateRange,
  getEditableSchedules,
  approveOvertime,
  getOvertimeSchedulesByStatus,
  getOvertimeSchedulesFlexible,
} from "../Service/workScheduleService";
import WorkScheduleForm from "./WorkScheduleForm";
import "./WorkSchedule.css";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaArrowRight,
  FaFilter,
  FaCheck,
} from "react-icons/fa";

const WorkScheduleList = () => {
  const [schedules, setSchedules] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [employeeId, setEmployeeId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [otStatus, setOtStatus] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 10;

  const mapStatus = (status) => {
    const normalizedStatus = status ? status.toString().toLowerCase() : "";
    if (["active", "true", "1"].includes(normalizedStatus)) {
      return "Active";
    }
    if (["inactive", "false", "0"].includes(normalizedStatus)) {
      return "Inactive";
    }
    if (["pending", "approved", "rejected"].includes(normalizedStatus)) {
      return normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1);
    }
    return status;
  };

  const loadSchedules = async () => {
    try {
      let data;
      if (employeeId && fromDate && toDate) {
        if (otStatus) {
          data = await getOvertimeSchedulesFlexible(employeeId, otStatus, fromDate, toDate);
        } else {
          data = await getSchedulesByEmployeeAndDateRange(employeeId, fromDate, toDate);
        }
      } else {
        data = await getWorkSchedules();
      }
      const mappedData = data.data?.result || data;
      const processedData = mappedData.map((s) => ({
        ...s,
        displayStatus: mapStatus(s.status),
      }));
      setSchedules(processedData);
    } catch (err) {
      console.error("Failed to load work schedules:", err);
      alert("Failed to load work schedules");
    }
  };

  useEffect(() => {
    loadSchedules();
  }, [employeeId, fromDate, toDate, otStatus]);

  const handleSave = async (form, isBulk = false) => {
    try {
      if (isBulk) {
        await createBulkWorkSchedules(form);
      } else if (editData) {
        await updateWorkSchedule(editData.scheduleId, form);
      } else {
        await createWorkSchedule(form);
      }
      setShowForm(false);
      setEditData(null);
      loadSchedules();
    } catch (err) {
      console.error("Failed to save work schedule(s):", err);
      alert("Failed to save schedule(s)");
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

  const handleSoftDelete = async (id) => {
    if (window.confirm("Soft delete this schedule?")) {
      try {
        await softDeleteWorkSchedule(id);
        loadSchedules();
      } catch (err) {
        console.error("Failed to soft delete work schedule:", err);
        alert("Failed to soft delete schedule");
      }
    }
  };

  const handleApproveOvertime = async (id) => {
    if (window.confirm("Approve this overtime schedule?")) {
      try {
        await approveOvertime(id);
        loadSchedules();
      } catch (err) {
        console.error("Failed to approve overtime:", err);
        alert("Failed to approve overtime");
      }
    }
  };

  // Pagination logic
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
    pageNumbers.push(1);
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
      pageNumbers.push(totalPages);
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
        <button
          className="WorkScheduleFilterButton"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter style={{ marginRight: 6 }} />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {showFilters && (
        <div className="WorkScheduleFilters">
          <div className="WorkScheduleFormField">
            <label>Employee ID:</label>
            <input
              type="text"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="Enter Employee ID"
            />
          </div>
          <div className="WorkScheduleFormField">
            <label>From Date:</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="WorkScheduleFormField">
            <label>To Date:</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <div className="WorkScheduleFormField">
            <label>OT Status:</label>
            <select
              value={otStatus}
              onChange={(e) => setOtStatus(e.target.value)}
            >
              <option value="">All</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
      )}

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
                    
                  </button>
                  <button
                    className="WorkScheduleDeleteButton"
                    onClick={() => handleDelete(s.scheduleId)}
                  >
                    <FaTrash style={{ marginRight: 4 }} />
                    
                  </button>
                  
                  {s.displayStatus === "Pending" && (
                    <button
                      className="WorkScheduleApproveButton"
                      onClick={() => handleApproveOvertime(s.scheduleId)}
                    >
                      <FaCheck style={{ marginRight: 4 }} />
                      Approve OT
                    </button>
                  )}
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