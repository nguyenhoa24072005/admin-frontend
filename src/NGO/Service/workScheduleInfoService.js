import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/work-schedule-infos";

const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getWorkScheduleInfos = async () => {
  const response = await axios.get(API_BASE_URL, {
    headers: getAuthHeaders(),
  });
  return response.data.result;
};

export const createWorkScheduleInfo = async (data) => {
  const response = await axios.post(API_BASE_URL, data, {
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
  });
  return response.data.result;
};

export const updateWorkScheduleInfo = async (id, data) => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, data, {
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
  });
  return response.data.result;
};

export const deleteWorkScheduleInfo = async (id) => {
  await axios.delete(`${API_BASE_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
};
