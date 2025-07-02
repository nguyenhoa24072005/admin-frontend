// src/Service/workScheduleService.js
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/work-schedules";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("authToken")}`,
});

export const getWorkSchedules = async () => {
  const res = await axios.get(API_BASE_URL, { headers: getAuthHeaders() });
  return res.data.result; // ✅ PHẢI trả về .result
};

export const createWorkSchedule = async (data) => {
  const res = await axios.post(API_BASE_URL, data, {
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
  });
  return res.data.result;
};

export const updateWorkSchedule = async (id, data) => {
  const res = await axios.put(`${API_BASE_URL}/${id}`, data, {
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
  });
  return res.data.result;
};

export const deleteWorkSchedule = async (id) => {
  await axios.delete(`${API_BASE_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
};
