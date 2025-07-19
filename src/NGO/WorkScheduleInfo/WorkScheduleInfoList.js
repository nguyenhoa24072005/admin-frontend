import React, { useEffect, useState } from "react";
import {
  getWorkScheduleInfos,
  createWorkScheduleInfo,
  updateWorkScheduleInfo,
  deleteWorkScheduleInfo,
} from "../Service/workScheduleInfoService";
import WorkScheduleInfoForm from "./WorkScheduleInfoForm";
import "./WorkScheduleInfo.css";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

const WorkScheduleInfoList = () => {
  const [infos, setInfos] = useState([]);
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

  const loadInfos = async () => {
    try {
      const data = await getWorkScheduleInfos();
      const mappedData = data.map((info) => {
        const displayStatus = mapStatus(info.status);
        console.log(
          `Schedule ${info.scheduleInfoId} status: ${info.status}, mapped to: ${displayStatus}`
        ); // Debug log
        return { ...info, displayStatus };
      });
      setInfos(mappedData);
    } catch (err) {
      console.error("Failed to load work schedule infos:", err);
      alert("Failed to load data");
    }
  };

  useEffect(() => {
    loadInfos();
  }, []);

  const handleSave = async (form) => {
    try {
      if (editData) {
        await updateWorkScheduleInfo(editData.scheduleInfoId, {
          ...form,
          status:
            form.status === "Active"
              ? "ACTIVE"
              : form.status === "Inactive"
              ? "INACTIVE"
              : form.status,
        });
      } else {
        await createWorkScheduleInfo({
          ...form,
          status:
            form.status === "Active"
              ? "ACTIVE"
              : form.status === "Inactive"
              ? "INACTIVE"
              : form.status,
        });
      }
      setShowForm(false);
      setEditData(null);
      loadInfos();
    } catch (err) {
      console.error("Failed to save work schedule info:", err);
      alert("Failed to save");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        await deleteWorkScheduleInfo(id);
        loadInfos();
        if (infos.length <= 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (err) {
        console.error("Failed to delete work schedule info:", err);
        alert("Failed to delete");
      }
    }
  };

  // Pagination logic with ellipsis
  const totalPages = Math.ceil(infos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInfos = infos.slice(startIndex, endIndex);

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
    <div className="WorkScheduleInfoContainer">
      <h2>Work Schedule Info List</h2>

      <div className="WorkScheduleInfoControls">
        <button
          className="WorkScheduleInfoAddButton"
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
            className="WorkScheduleInfoOverlay"
            onClick={() => setShowForm(false)}
          />
          <WorkScheduleInfoForm
            editData={editData}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditData(null);
            }}
          />
        </>
      )}

      <table className="WorkScheduleInfoTable">
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
          {currentInfos.length > 0 ? (
            currentInfos.map((info) => (
              <tr key={info.scheduleInfoId}>
                <td>{info.scheduleInfoId}</td>
                <td>{info.name}</td>
                <td>{info.description}</td>
                <td>{info.defaultStartTime}</td>
                <td>{info.defaultEndTime}</td>
                <td className={`WorkScheduleInfoStatus ${info.displayStatus}`}>
                  {info.displayStatus}
                </td>
                <td>
                  <button
                    className="WorkScheduleInfoEditButton"
                    onClick={() => {
                      setEditData(info);
                      setShowForm(true);
                    }}
                  >
                    <FaEdit style={{ marginRight: 4 }} />
                    
                  </button>
                  <button
                    className="WorkScheduleInfoDeleteButton"
                    onClick={() => handleDelete(info.scheduleInfoId)}
                  >
                    <FaTrash style={{ marginRight: 4 }} />
                  </button>
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

export default WorkScheduleInfoList;
