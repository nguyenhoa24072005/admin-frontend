// src/Service/EmployeeHistoryService.js
import axios from "axios";

const API_BASE_URL = "https://hr-sem4-project-egcmcze0dmgwhdgb.eastasia-01.azurewebsites.net/api/employee-histories";

const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getAllHistories = async () => {
  const response = await axios.get(API_BASE_URL, {
    headers: getAuthHeaders(),
  });
  return response.data.result;
};

export const getHistoriesByEmployeeId = async (employeeId) => {
  const response = await axios.get(`${API_BASE_URL}/employee/${employeeId}`, {
    headers: getAuthHeaders(),
  });
  return response.data.result;
};

export const getHistoryById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data.result;
};

export const createHistory = async (data) => {
  const response = await axios.post(API_BASE_URL, data, {
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
  });
  return response.data.result;
};

export const updateHistory = async (id, data) => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, data, {
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
  });
  return response.data.result;
};

export const deleteHistory = async (id) => {
  await axios.delete(`${API_BASE_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
};
