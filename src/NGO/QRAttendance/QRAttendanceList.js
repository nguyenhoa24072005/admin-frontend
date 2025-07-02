import React, { useEffect, useState } from "react";
import { getAllActiveAttendances, deleteAttendance } from "../Service/qrAttendanceService";

const QRAttendanceList = () => {
  const [attendances, setAttendances] = useState([]);
  const [search, setSearch] = useState("");

  const loadData = async () => {
    try {
      const data = await getAllActiveAttendances();
      setAttendances(data);
    } catch (err) {
      alert("Failed to fetch QR Attendances.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (qrId) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá bản ghi này không?")) {
      try {
        await deleteAttendance(qrId);
        loadData();
      } catch {
        alert("Xoá thất bại.");
      }
    }
  };

  const filtered = attendances.filter((a) =>
    a.employee?.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 20 }}>
      <h2>Danh sách chấm công QR / FaceGPS</h2>

      <div style={{ marginBottom: 15 }}>
        <input
          type="text"
          placeholder="Tìm theo tên nhân viên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: 6, width: 250 }}
        />
      </div>

      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nhân viên</th>
            <th>Ngày chấm</th>
            <th>Phương thức</th>
            <th>Trạng thái</th>
            <th>Lat</th>
            <th>Long</th>
            <th>Ảnh nhận diện</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length > 0 ? (
            filtered.map((a) => (
              <tr key={a.qrId}>
                <td>{a.qrId}</td>
                <td>{a.employee?.fullName || "Không rõ"}</td>
                <td>{new Date(a.attendanceDate).toLocaleDateString()}</td>
                <td>{a.attendanceMethod}</td>
                <td>{a.status}</td>
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
                    "Không có"
                  )}
                </td>
                <td>
                  <button onClick={() => handleDelete(a.qrId)}>Xoá</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>
                Không tìm thấy bản ghi nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default QRAttendanceList;
