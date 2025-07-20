import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/qrattendance";

const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getAllActiveAttendances = async () => {
  const response = await axios.get(`${API_BASE_URL}/active`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const deleteAttendance = async (qrId) => {
  await axios.delete(`${API_BASE_URL}/${qrId}`, {
    headers: getAuthHeaders(),
  });
};

export const filterAttendances = async (status, startDate, endDate) => {
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  const response = await axios.get(`${API_BASE_URL}/filter?${params.toString()}`, {
    headers: getAuthHeaders(),
  });

  return response.data;
};

