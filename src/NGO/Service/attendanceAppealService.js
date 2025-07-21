// src/Service/attendanceAppealService.js
import axios from "axios";

const API_BASE_URL = "https://hr-sem4-project-egcmcze0dmgwhdgb.eastasia-01.azurewebsites.net/api/attendance-appeals";

const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getAppealsByEmployee = async (employeeId) => {
  const response = await axios.get(API_BASE_URL, {
    headers: getAuthHeaders(),
    params: { employeeId },
  });
  return response.data;
};

export const getAllAppeals = async () => {
  const response = await axios.get(`${API_BASE_URL}/all`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const createAppeal = async (data) => {
  const response = await axios.post(API_BASE_URL, data, {
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const updateAppealStatus = async (id, data) => {
  const response = await axios.put(`${API_BASE_URL}/${id}/status`, data, {
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
