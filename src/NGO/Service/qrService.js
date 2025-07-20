// src/Service/qrService.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/qrcodes";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("authToken")}`,
});

export const fetchAllQRInfos = async () => {
  const res = await axios.get(API_URL, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const searchQRInfos = async (query) => {
  const res = await axios.get(`${API_URL}/search?q=${query}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const getQRInfoById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const deleteQRInfo = async (id) => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
};

export const filterQRInfos = async (status, startDate, endDate) => {
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (startDate) params.append("startDate", new Date(startDate).toISOString());
  if (endDate) params.append("endDate", new Date(endDate).toISOString());

  const res = await axios.get(`${API_URL}/filter?${params.toString()}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

