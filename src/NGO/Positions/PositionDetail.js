import React from "react";

function PositionDetail({ position }) {
  if (!position) return null;

  return (
    <div
      style={{ marginTop: "10px", border: "1px solid #ccc", padding: "10px" }}
    >
      <h4>Chi tiết chức vụ</h4>
      <p>ID: {position.positionId}</p>
      <p>Tên: {position.positionName}</p>
      <p>Trạng thái: {position.status}</p>
    </div>
  );
}

export default PositionDetail;
