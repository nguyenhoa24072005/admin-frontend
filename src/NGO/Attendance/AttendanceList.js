import React, { useEffect, useState } from "react";
import {
  getAttendances,
  createAttendance,
  updateAttendance,
  deleteAttendance,
} from "../Service/AttendanceService";
import AttendanceForm from "./AttendanceForm";
import "./Attendance.css";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

const AttendanceList = () => {
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const mapStatus = (status) => {
    // Normalize status for display
    const normalizedStatus = status ? status.toString().toLowerCase() : "";
    if (["present", "active", "true", "1"].includes(normalizedStatus)) {
      return "Active";
    }
    if (
      ["absent", "late", "onleave", "inactive", "false", "0"].includes(
        normalizedStatus
      )
    ) {
      return "Inactive";
    }
    return status; // Fallback to original status
  };

  const loadData = async () => {
    try {
      const res = await getAttendances();
      const mappedData = res.map((att) => {
        const displayStatus = mapStatus(att.status);
        console.log(
          `Attendance ${att.attendanceId} status: ${att.status}, mapped to: ${displayStatus}`
        ); // Debug log
        return { ...att, displayStatus };
      });
      setData(mappedData);
    } catch (err) {
      console.error("Failed to load attendance data:", err);
      alert("Failed to load attendance data.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (form) => {
    try {
      const payload = {
        ...form,
        status: form.status === "Active" ? "Present" : form.status, // Map back to backend value
      };
      if (editData) {
        await updateAttendance(editData.attendanceId, payload);
      } else {
        await createAttendance(payload);
      }
      setShowForm(false);
      setEditData(null);
      loadData();
    } catch (err) {
      console.error("Failed to save attendance:", err);
      alert("Failed to save attendance");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteAttendance(id);
        loadData();
        if (data.length <= 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (err) {
        console.error("Failed to delete attendance:", err);
        alert("Failed to delete attendance");
      }
    }
  };

  // Pagination logic with ellipsis
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

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
    <div className="AttendanceContainer">
      <h2>Attendance List</h2>

      <div className="AttendanceControls">
        <button
          className="AttendanceAddButton"
          onClick={() => {
            setEditData(null);
            setShowForm(true);
          }}
        >
          <FaPlus style={{ marginRight: 6 }} />
          Add Attendance
        </button>
      </div>

      {showForm && (
        <>
          <div
            className="AttendanceOverlay"
            onClick={() => setShowForm(false)}
          />
          <AttendanceForm
            editData={editData}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditData(null);
            }}
          />
        </>
      )}

      <table className="AttendanceTable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Employee ID</th>
            <th>Employee Name</th>
            <th>Date</th>
            <th>Total Hours</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentData.length > 0 ? (
            currentData.map((att) => (
              <tr key={att.attendanceId}>
                <td>{att.attendanceId}</td>
                <td>{att.employee?.employeeId || "N/A"}</td>
                <td>{att.employee?.fullName || "N/A"}</td>
                <td>{att.attendanceDate?.slice(0, 10) || "N/A"}</td>
                <td>{att.totalHours || "0"}</td>
                <td className={`AttendanceStatus ${att.displayStatus}`}>
                  {att.status} {/* Display original status for clarity */}
                </td>
                <td>
                  <button
                    className="AttendanceEditButton"
                    onClick={() => {
                      setEditData(att);
                      setShowForm(true);
                    }}
                  >
                    <FaEdit style={{ marginRight: 4 }} />
                    Edit
                  </button>
                  <button
                    className="AttendanceDeleteButton"
                    onClick={() => handleDelete(att.attendanceId)}
                  >
                    <FaTrash style={{ marginRight: 4 }} />
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No records found.
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

export default AttendanceList;
