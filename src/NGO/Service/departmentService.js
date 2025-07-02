import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/departments";

// Lấy token từ localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    Authorization: `Bearer ${token}`,
  };
};

// ✅ GET: Lấy danh sách phòng ban (có thể lọc theo status)
export const getDepartments = async (status = "") => {
  try {
    const response = await axios.get(API_BASE_URL, {
      headers: getAuthHeaders(),
      params: status ? { status } : {},
    });
    return response.data.result;
  } catch (error) {
    console.error("Failed to fetch departments:", error);
    throw error;
  }
};

// ✅ POST: Thêm phòng ban mới
export const addDepartment = async (departmentData) => {
  try {
    const response = await axios.post(API_BASE_URL, departmentData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
    });
    return response.data.result;
  } catch (error) {
    console.error("Failed to add department:", error);
    throw error;
  }
};

// ✅ PUT: Cập nhật phòng ban theo ID
export const updateDepartment = async (id, departmentData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, departmentData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
    });
    return response.data.result;
  } catch (error) {
    console.error("Failed to update department:", error);
    throw error;
  }
};

// ✅ DELETE: Xóa phòng ban theo ID
export const deleteDepartment = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    console.error("Failed to delete department:", error);
    throw error;
  }
};

// ✅ GET (Native): Lấy tất cả phòng ban qua native SQL
export const getAllDepartmentsNative = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/native`, {
      headers: getAuthHeaders(),
    });
    return response.data.result;
  } catch (error) {
    console.error("Failed to fetch departments with native SQL:", error);
    throw error;
  }
};
