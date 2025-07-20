import React, { useEffect, useState } from "react";
import {
  getAllActiveAttendances,
  deleteAttendance,
  filterAttendances,
} from "../Service/qrAttendanceService";
import "./QRAttendance.css";
import { FaSearch, FaTrash, FaArrowLeft, FaArrowRight } from "react-icons/fa";

const QRAttendanceList = () => {
  const [attendances, setAttendances] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");


  const mapStatus = (status) => {
    const normalizedStatus = status ? status.toString().toLowerCase() : "";
    if (["valid", "active", "true", "1"].includes(normalizedStatus)) {
      return "Active";
    }
    if (["expired", "inactive", "false", "0"].includes(normalizedStatus)) {
      return "Inactive";
    }
    return status;
  };

  const loadData = async () => {
    try {
      const data = await getAllActiveAttendances();
      const mappedData = data.map((a) => {
        const displayStatus = mapStatus(a.status);
        console.log(
          `Attendance ${a.qrId} status: ${a.status}, mapped to: ${displayStatus}`
        );
        return { ...a, displayStatus };
      });
      setAttendances(mappedData);
    } catch (err) {
      console.error("Failed to fetch QR Attendances:", err);
      alert("Failed to fetch QR Attendances.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (qrId) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await deleteAttendance(qrId);
        loadData();
        if (filtered.length <= 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (err) {
        console.error("Failed to delete attendance:", err);
        alert("Failed to delete.");
      }
    }
  };

  const filtered = attendances.filter((a) =>
    a.employee?.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAttendances = filtered.slice(startIndex, endIndex);

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
  const handleFilter = async () => {
    try {
      const data = await filterAttendances(statusFilter, startDate, endDate);
      const mappedData = data.map((a) => ({
        ...a,
        displayStatus: mapStatus(a.activeStatus),
      }));
      setAttendances(mappedData);
      setCurrentPage(1);
    } catch (err) {
      console.error("Failed to filter attendances:", err);
      alert("Failed to filter attendances.");
    }
  };

  return (
    <div className="QRAttendanceContainer">
      <h2>QR / FaceGPS Attendance List</h2>

      <div className="QRAttendanceControls">
        <input
          type="text"
          placeholder="Search by employee name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="QRAttendanceSearchButton"
          onClick={() => setCurrentPage(1)}
        >
          <FaSearch style={{ marginRight: 6 }} />
          Search
        </button>
      </div>
      <div className="QRAttendanceFilters">
        <label>
          Status:
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </label>

        <label>
          Start Date:
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </label>

        <label>
          End Date:
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </label>

        <button className="QRAttendanceSearchButton" onClick={handleFilter}>
          <FaSearch style={{ marginRight: 6 }} />
          Filter
        </button>
      </div>


      <table className="QRAttendanceTable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Employee</th>
            <th>Attendance Date</th>
            <th>Method</th>
            <th>Status</th>
            <th>Lat</th>
            <th>Long</th>
            <th>Face Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentAttendances.length > 0 ? (
            currentAttendances.map((a) => (
              <tr key={a.qrId}>
                <td>{a.qrId}</td>
                <td>{a.employee?.fullName || "Unknown"}</td>
                <td>{new Date(a.attendanceDate).toLocaleDateString()}</td>
                <td>{a.attendanceMethod}</td>
                <td className={`QRAttendanceStatus ${a.displayStatus}`}>
                  {a.displayStatus}
                </td>
                <td>{a.latitude}</td>
                <td>{a.longitude}</td>
                <td>
                  {a.faceRecognitionImage ? (
                    <img
                      src={`data:image/jpeg;base64,${a.faceRecognitionImage}`}
                      alt="face"
                      width="60"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>
                  <button
                    className="QRAttendanceDeleteButton"
                    onClick={() => handleDelete(a.qrId)}
                  >
                    <FaTrash style={{ marginRight: 4 }} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>
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
                  className={`PaginationNumber ${currentPage === page ? "active" : ""
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

export default QRAttendanceList;
