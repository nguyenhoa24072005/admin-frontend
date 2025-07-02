import axios from "axios";

const API_URL = "https://charitynavigator-hma3agega6fwfgb2.canadacentral-01.azurewebsites.net/api/ProgramDonation"; // Thay đổi URL nếu cần

//Lấy danh sách lịch sử giao dịch
export const getProgramDonations = async (searchQuery = "") => {
  try {
    const response = await axios.get(`${API_URL}?searchQuery=${searchQuery}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching program donations:", error);
    throw error;
  }
};
export const getProgramDonationsForNGOAndProgram = async (ngoId, programId) => {
  try {
    const response = await axios.get(`${API_URL}/ngo/${ngoId}/program/${programId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching donations:", error);
    throw error;
  }
};
// Lấy thông tin chi tiết của một giao dịch theo ID
export const getProgramDonationById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching program donation by ID:", error);
    throw error;
  }
};

// Thêm một giao dịch mới
export const addProgramDonation = async (donationData) => {
  try {
    const response = await axios.post(API_URL, donationData);
    return response.data;
  } catch (error) {
    console.error("Error adding program donation:", error);
    throw error;
  }
};

// Cập nhật giao dịch
export const updateProgramDonation = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating program donation:", error);
    throw error;
  }
};

// Xóa giao dịch
export const deleteProgramDonation = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Error deleting program donation:", error);
    throw error;
  }
};
