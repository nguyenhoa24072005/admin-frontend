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
