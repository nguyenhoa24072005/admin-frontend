import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/employees";

const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getEmployees = async (status = "", role = "") => {
  const params = {};
  if (status) params.status = status;
  if (role) params.role = role;

  const response = await axios.get(API_BASE_URL, {
    headers: getAuthHeaders(),
    params,
  });
  return response.data.result;
};

export const getEmployeesByRole = async (role) => {
  const response = await axios.get(`${API_BASE_URL}/by-role`, {
    headers: getAuthHeaders(),
    params: { role },
  });
  return response.data.result;
};

export const addEmployee = async (data) => {
  const response = await axios.post(API_BASE_URL, data, {
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
  });
  return response.data.result;
};

export const updateEmployee = async (id, data) => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, data, {
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
  });
  return response.data.result;
};

export const deleteEmployee = async (id) => {
  await axios.delete(`${API_BASE_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
};

export const getAllEmployeesNative = async () => {
  const response = await axios.get(`${API_BASE_URL}/native`, {
    headers: getAuthHeaders(),
  });
  return response.data.result;
};
