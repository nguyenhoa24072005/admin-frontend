import axios from "axios";

const API_BASE_URL = " https://charitynavigator-hma3agega6fwfgb2.canadacentral-01.azurewebsites.net/api/GalleryImage";

export const fetchGalleryImages = async (searchQuery = "", page = 1, size = 10) => {
  const response = await axios.get(`${API_BASE_URL}?searchQuery=${searchQuery}&page=${page}&size=${size}`);
  return response.data;
};

export const fetchGalleryImageById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/${id}`);
  return response.data;
};

export const addGalleryImage = async (formData) => {
  const response = await axios.post(API_BASE_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateGalleryImage = async (id, formData) => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteGalleryImage = async (id) => {
  await axios.delete(`${API_BASE_URL}/${id}`);
};
