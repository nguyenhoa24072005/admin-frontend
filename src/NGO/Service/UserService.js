// src/Service/userService.js
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/users";

const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getUsers = async (status = "") => {
  const response = await axios.get(API_BASE_URL, {
    headers: getAuthHeaders(),
    params: status ? { status } : {},
  });
  return response.data.result;
};

export const registerUser = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/register`, data, {
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
  });
  return response.data.result;
};

export const updateUser = async (id, data) => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, data, {
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
  });
  return response.data.result;
};

export const deleteUser = async (id) => {
  await axios.delete(`${API_BASE_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
};
export const getUserById = async (userId) => {
  // Nếu muốn lấy thông tin người dùng hiện tại
  const response = await axios.get(`${API_BASE_URL}/me`, {
    headers: getAuthHeaders(),
  });

  // Nếu muốn lấy theo userId
  // const response = await axios.get(`${API_BASE_URL}/${userId}`, {
  //   headers: getAuthHeaders(),
  // });

  return response.data.result;
};
