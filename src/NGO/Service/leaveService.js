// src/Service/leaveService.js
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/leaves";

const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getLeaves = async () => {
  const response = await axios.get(API_BASE_URL, {
    headers: getAuthHeaders(),
  });
  return response.data.result;
};

export const createLeave = async (data) => {
  const response = await axios.post(API_BASE_URL, data, {
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
  });
  return response.data.result;
};

export const deleteLeave = async (id) => {
  await axios.delete(`${API_BASE_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
};
