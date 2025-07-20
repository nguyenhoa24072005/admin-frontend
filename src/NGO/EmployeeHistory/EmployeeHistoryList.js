import React, { useEffect, useState } from "react";
import {
  getAllHistories,
  getHistoriesByEmployeeId,
  deleteHistory,
} from "../Service/EmployeeHistoryService";
import EmployeeHistoryForm from "./EmployeeHistoryForm";
import "./EmployeeHistory.css";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

const EmployeeHistoryList = () => {
  const [histories, setHistories] = useState([]);
  const [editingHistory, setEditingHistory] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [employeeIdFilter, setEmployeeIdFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const loadHistories = async () => {
    try {
      const data = employeeIdFilter
        ? await getHistoriesByEmployeeId(employeeIdFilter)
        : await getAllHistories();
      // Map WORKING/RESIGNED to Active/Inactive for display
      const mappedData = data.map((h) => ({
        ...h,
        displayStatus: h.status === "WORKING" ? "Active" : "Inactive",
      }));
      setHistories(mappedData);
    } catch (err) {
      alert("Failed to load employee histories.");
    }
  };

  useEffect(() => {
    loadHistories();
  }, [employeeIdFilter]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this history?")) {
      await deleteHistory(id);
      loadHistories();
      if (filteredHistories.length <= 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const filteredHistories = histories;

  const totalPages = Math.ceil(filteredHistories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentHistories = filteredHistories.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="EmployeeHistoryContainer">
      <h2>Employee History List</h2>

      <div className="EmployeeHistoryControls">
        <input
          type="text"
          placeholder="Filter by Employee ID"
          value={employeeIdFilter}
          onChange={(e) => setEmployeeIdFilter(e.target.value)}
        />
        <button
          className="EmployeeHistoryAddButton"
          onClick={() => {
            setEditingHistory(null);
            setShowForm(true);
          }}
        >
          <FaPlus style={{ marginRight: 6 }} />
          Add History
        </button>
      </div>

      {showForm && (
        <EmployeeHistoryForm
          editingHistory={editingHistory}
          onClose={() => {
            setEditingHistory(null);
            setShowForm(false);
            loadHistories();
          }}
        />
      )}

      <table className="EmployeeHistoryTable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Employee</th>
            <th>Department</th>
            <th>Position</th>
            <th>Start</th>
            <th>End</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentHistories.length > 0 ? (
            currentHistories.map((h) => (
              <tr key={h.historyId}>
                <td>{h.historyId}</td>
                <td>{h.employeeName}</td>
                <td>{h.departmentName}</td>
                <td>{h.positionName}</td>
                <td>{h.startDate}</td>
                <td>{h.endDate || "-"}</td>
                <td>{h.reason || "-"}</td>
                <td className={`EmployeeHistoryStatus ${h.displayStatus}`}>
                  {h.displayStatus}
                </td>
                <td className="iconemployhis">
                  <button
                    className="EmployeeHistoryEditButton"
                    onClick={() => {
                      setEditingHistory(h);
                      setShowForm(true); // <<< Bổ sung dòng này
                    }}
                  >
                    <FaEdit style={{ marginRight: 4 }} />
                    
                  </button>
                  <button
                    className="EmployeeHistoryDeleteButton"
                    onClick={() => handleDelete(h.historyId)}
                  >
                    <FaTrash style={{ marginRight: 4 }} />
                    
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>
                No histories found.
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
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
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

export default EmployeeHistoryList;
