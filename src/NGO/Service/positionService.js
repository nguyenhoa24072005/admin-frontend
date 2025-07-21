// src/Service/positionService.js
import axios from "axios";

const API_BASE_URL = "https://hr-sem4-project-egcmcze0dmgwhdgb.eastasia-01.azurewebsites.net/api/positions";

// ✅ Lấy token từ localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken"); // 🔁 Đổi sang "authToken" cho thống nhất với departmentService
  return {
    Authorization: `Bearer ${token}`,
  };
};

// ✅ GET: Lấy danh sách chức vụ (có thể lọc theo status)
export const getPositions = async (status = "") => {
  try {
    const response = await axios.get(API_BASE_URL, {
      headers: getAuthHeaders(),
      params: status ? { status } : {},
    });
    return response.data.result;
  } catch (error) {
    console.error("Failed to fetch positions:", error);
    throw error;
  }
};

// ✅ POST: Thêm chức vụ mới
export const addPosition = async (positionData) => {
  try {
    const response = await axios.post(API_BASE_URL, positionData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
    });
    return response.data.result;
  } catch (error) {
    console.error("Failed to add position:", error);
    throw error;
  }
};

// ✅ PUT: Cập nhật chức vụ
export const updatePosition = async (id, positionData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, positionData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
    });
    return response.data.result;
  } catch (error) {
    console.error("Failed to update position:", error);
    throw error;
  }
};

// ✅ DELETE: Xóa chức vụ
export const deletePosition = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    console.error("Failed to delete position:", error);
    throw error;
  }
};

// ✅ GET (Native): Lấy tất cả chức vụ qua native SQL (nếu có)
export const getAllPositionsNative = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/native`, {
      headers: getAuthHeaders(),
    });
    return response.data.result;
  } catch (error) {
    console.error("Failed to fetch positions with native SQL:", error);
    throw error;
  }
};

