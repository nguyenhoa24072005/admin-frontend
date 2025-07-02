import axios from 'axios';

const API_URL = 'https://charitynavigator-hma3agega6fwfgb2.canadacentral-01.azurewebsites.net/api'; // URL backend của bạn

// Hàm lấy tất cả các NGO, có thể tìm kiếm qua query string
export const getNGOs = async (searchQuery = '') => {
  try {
    const response = await axios.get(`${API_URL}/ngo?searchQuery=${searchQuery}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching NGOs:', error);
    throw error;
  }
};

// Hàm lấy một NGO theo ID
export const getNGOById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/ngo/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching NGO by ID:', error);
    throw error;
  }
};

// Hàm thêm một NGO mới
export const addNGO = async (ngoData) => {
  try {
    const response = await axios.post(`${API_URL}/ngo`, ngoData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}` // Thêm token nếu cần
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error adding NGO:', error);
    throw error;
  }
};

// Hàm cập nhật một NGO
export const updateNGO = async (id, ngoData) => {
  try {
    const response = await axios.put(`${API_URL}/ngo/${id}`, ngoData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating NGO:', error);
    throw error;
  }
};

// Hàm xóa một NGO
export const deleteNGO = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/ngo/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting NGO:', error);
    throw error;
  }
};

// Hàm tìm kiếm NGO theo nhiều tiêu chí
export const searchNGOs = async (name, code, isApproved) => {
  try {
    const response = await axios.get(`${API_URL}/ngo/search`, {
      params: { name, code, isApproved }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching NGOs:', error);
    throw error;
  }
};
