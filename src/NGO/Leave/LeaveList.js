import React, { useEffect, useState } from "react";
import { getLeaves, createLeave, deleteLeave } from "../Service/leaveService";
import LeaveForm from "./LeaveForm";
import "./Leave.css";
import { FaPlus, FaTrash, FaArrowLeft, FaArrowRight } from "react-icons/fa";

const LeaveList = () => {
  const [leaves, setLeaves] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editLeave, setEditLeave] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const mapStatus = (status) => {
    // Normalize status for display
    const normalizedStatus = status ? status.toString().toLowerCase() : "";
    if (["approved", "active", "true", "1"].includes(normalizedStatus)) {
      return "Active";
    }
    if (
      ["pending", "rejected", "inactive", "false", "0"].includes(
        normalizedStatus
      )
    ) {
      return "Inactive";
    }
    return status; // Fallback to original status
  };

  const loadLeaves = async () => {
    try {
      const data = await getLeaves();
      const mappedData = data.map((l) => {
        const displayStatus = mapStatus(l.status);
        const displayActiveStatus = mapStatus(l.activeStatus);
        console.log(
          `Leave ${l.leaveId} status: ${l.status}, mapped to: ${displayStatus}, activeStatus: ${l.activeStatus}, mapped to: ${displayActiveStatus}`
        ); // Debug log
        return { ...l, displayStatus, displayActiveStatus };
      });
      setLeaves(mappedData);
    } catch (err) {
      console.error("Failed to fetch leave requests:", err);
      alert("Failed to fetch leave requests");
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const handleSave = async (form) => {
    try {
      await createLeave({
        ...form,
        status:
          form.status === "Active"
            ? "APPROVED"
            : form.status === "Inactive"
            ? "PENDING"
            : form.status,
      });
      setShowForm(false);
      setEditLeave(null);
      loadLeaves();
    } catch (err) {
      console.error("Failed to save leave request:", err);
      alert("Failed to save leave request");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteLeave(id);
        loadLeaves();
        if (leaves.length <= 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (err) {
        console.error("Failed to delete leave request:", err);
        alert("Failed to delete leave request");
      }
    }
  };

  // Pagination logic with ellipsis
  const totalPages = Math.ceil(leaves.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLeaves = leaves.slice(startIndex, endIndex);

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
    <div className="LeaveContainer">
      <h2>Leave Requests</h2>

      <div className="LeaveControls">
        <button
          className="LeaveAddButton"
          onClick={() => {
            setEditLeave(null);
            setShowForm(true);
          }}
        >
          <FaPlus style={{ marginRight: 6 }} />
          New Leave Request
        </button>
      </div>

      {showForm && (
        <>
          <div className="LeaveOverlay" onClick={() => setShowForm(false)} />
          <LeaveForm
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditLeave(null);
            }}
            editLeave={editLeave}
          />
        </>
      )}

      <table className="LeaveTable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Employee</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Type</th>
            <th>Status</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentLeaves.length > 0 ? (
            currentLeaves.map((l) => (
              <tr key={l.leaveId}>
                <td>{l.leaveId}</td>
                <td>{l.employeeName}</td>
                <td>{l.leaveStartDate?.slice(0, 10)}</td>
                <td>{l.leaveEndDate?.slice(0, 10)}</td>
                <td>{l.leaveType}</td>
                <td className={`LeaveStatus ${l.displayStatus}`}>
                  {l.displayStatus}
                </td>
                <td className={`LeaveActiveStatus ${l.displayActiveStatus}`}>
                  {l.displayActiveStatus}
                </td>
                <td>
                  <button
                    className="LeaveDeleteButton"
                    onClick={() => handleDelete(l.leaveId)}
                  >
                    <FaTrash style={{ marginRight: 4 }} />
                
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                No leave requests found.
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

export default LeaveList;
