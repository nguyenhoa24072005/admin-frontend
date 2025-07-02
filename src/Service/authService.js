import axios from "axios";

const API_URL = "https://charitynavigator-hma3agega6fwfgb2.canadacentral-01.azurewebsites.net/api";

const register = async (data) => {
  const response = await axios.post(`${API_URL}/auth/register`, data);
  return response.data;
};

const login = async (data) => {
  const response = await axios.post(`${API_URL}/auth/login`, data);
  return response.data;
};

const forgotPassword = async (data) => {
  const response = await axios.post(`${API_URL}/auth/forgot-password`, data);
  return response.data;
};

const resetPassword = async (data) => {
  const response = await axios.post(`${API_URL}/auth/reset-password`, data);
  return response.data;
};

export default {
  register,
  login,
  forgotPassword,
  resetPassword,
}