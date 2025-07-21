import axios from "axios";

const API_BASE_URL = "https://hr-sem4-project-egcmcze0dmgwhdgb.eastasia-01.azurewebsites.net/api/attendances";

const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getAttendances = async () => {
  const response = await axios.get(`${API_BASE_URL}/with-employee`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const createAttendance = async (data) => {
  const response = await axios.post(API_BASE_URL, data, {
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const updateAttendance = async (id, data) => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, data, {
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const deleteAttendance = async (id) => {
  await axios.delete(`${API_BASE_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
};
