// src/Component/QRInfoList.js
import React, { useEffect, useState } from "react";
import { fetchAllQRInfos, searchQRInfos, deleteQRInfo } from "../Service/qrService";

const QRInfoList = () => {
  const [qrs, setQrs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const loadQRs = async () => {
    const data = await fetchAllQRInfos();
    setQrs(data);
  };

  useEffect(() => {
    loadQRs();
  }, []);

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      const results = await searchQRInfos(searchTerm);
      setQrs(results);
    } else {
      loadQRs();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this QR?")) {
      await deleteQRInfo(id);
      loadQRs();
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>QR Info List</h2>
      <div style={{ marginBottom: 15 }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by QR Code or Description"
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <table border="1" cellPadding="8" style={{ width: "100%" }}>
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
          {qrs.length > 0 ? (
            qrs.map((qr) => (
              <tr key={qr.qrInfoId}>
                <td>{qr.qrCode}</td>
                <td>{qr.description}</td>
                <td>{qr.location?.name || "N/A"}</td>
                <td>{qr.shift}</td>
                <td>{qr.createdBy?.username || "N/A"}</td>
                <td>{new Date(qr.createdAt).toLocaleString()}</td>
                <td>{qr.expiredAt ? new Date(qr.expiredAt).toLocaleDateString() : "None"}</td>
                <td>{qr.status}</td>
                <td>
                  <button onClick={() => handleDelete(qr.qrInfoId)}>Delete</button>
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
    </div>
  );
};

export default QRInfoList;
