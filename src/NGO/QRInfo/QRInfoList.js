import React, { useEffect, useState } from "react";
import {
  fetchAllQRInfos,
  searchQRInfos,
  deleteQRInfo,
} from "../Service/qrService";
import "./QRInfo.css";
import { FaSearch, FaTrash, FaArrowLeft, FaArrowRight } from "react-icons/fa";

const QRInfoList = () => {
  const [qrs, setQrs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const mapStatus = (status) => {
    // Normalize status to handle various backend values
    const normalizedStatus = status ? status.toString().toLowerCase() : "";
    if (["valid", "active", "true", "1"].includes(normalizedStatus)) {
      return "Active";
    }
    if (["expired", "inactive", "false", "0"].includes(normalizedStatus)) {
      return "Inactive";
    }
    return status; // Fallback to original status if unknown
  };

  const loadQRs = async () => {
    try {
      const data = await fetchAllQRInfos();
      const mappedData = data.map((qr) => {
        const displayStatus = mapStatus(qr.status);
        console.log(
          `QR ${qr.qrInfoId} status: ${qr.status}, mapped to: ${displayStatus}`
        ); // Debug log
        return { ...qr, displayStatus };
      });
      setQrs(mappedData);
    } catch (err) {
      console.error("Failed to load QR infos:", err);
      alert("Failed to load QR infos.");
    }
  };

  useEffect(() => {
    if (searchTerm.trim()) {
      handleSearch();
    } else {
      loadQRs();
    }
  }, [searchTerm]);

  const handleSearch = async () => {
    try {
      if (searchTerm.trim()) {
        const results = await searchQRInfos(searchTerm);
        const mappedResults = results.map((qr) => {
          const displayStatus = mapStatus(qr.status);
          console.log(
            `Search QR ${qr.qrInfoId} status: ${qr.status}, mapped to: ${displayStatus}`
          ); // Debug log
          return { ...qr, displayStatus };
        });
        setQrs(mappedResults);
      } else {
        loadQRs();
      }
      setCurrentPage(1); // Reset to first page on search
    } catch (err) {
      console.error("Failed to search QR infos:", err);
      alert("Failed to search QR infos.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this QR?")) {
      try {
        await deleteQRInfo(id);
        loadQRs();
        if (qrs.length <= 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (err) {
        console.error("Failed to delete QR info:", err);
        alert("Failed to delete QR info.");
      }
    }
  };

  // Pagination logic with ellipsis
  const totalPages = Math.ceil(qrs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentQRs = qrs.slice(startIndex, endIndex);

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
    <div className="QRInfoContainer">
      <h2>QR Info List</h2>

      <div className="QRInfoControls">
        <input
          type="text"
          placeholder="Search by QR Code or Description"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="QRInfoSearchButton" onClick={handleSearch}>
          <FaSearch style={{ marginRight: 6 }} />
          Search
        </button>
      </div>

      <table className="QRInfoTable">
        <thead>
          <tr>
            <th>QR Code</th>
            <th>Description</th>
            <th>Location</th>
            <th>Shift</th>
            <th>Created By</th>
            <th>Created At</th>
            <th>Expired At</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentQRs.length > 0 ? (
            currentQRs.map((qr) => (
              <tr key={qr.qrInfoId}>
                <td>{qr.qrCode}</td>
                <td>{qr.description}</td>
                <td>{qr.location?.name || "N/A"}</td>
                <td>{qr.shift}</td>
                <td>{qr.createdBy?.username || "N/A"}</td>
                <td>{new Date(qr.createdAt).toLocaleString()}</td>
                <td>
                  {qr.expiredAt
                    ? new Date(qr.expiredAt).toLocaleDateString()
                    : "None"}
                </td>
                <td className={`QRInfoStatus ${qr.displayStatus}`}>
                  {qr.displayStatus}
                </td>
                <td>
                  <button
                    className="QRInfoDeleteButton"
                    onClick={() => handleDelete(qr.qrInfoId)}
                  >
                    <FaTrash style={{ marginRight: 4 }} />
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>
                No QR data found.
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

export default QRInfoList;
