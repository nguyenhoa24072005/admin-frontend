import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/work-schedules";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("authToken")}`,
});

export const getWorkSchedules = async (params = {}) => {
  try {
    const res = await axios.get(API_BASE_URL, {
      headers: getAuthHeaders(),
      params,
    });
    return res.data.result || [];
  } catch (error) {
    console.error("Error fetching work schedules:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const createWorkSchedule = async (data) => {
  try {
    const res = await axios.post(API_BASE_URL, data, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
    });
    return res.data.result;
  } catch (error) {
    console.error("Error creating work schedule:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const createBulkWorkSchedules = async (data) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/bulk`, data, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
    });
    return res.data.result;
  } catch (error) {
    console.error("Error creating bulk work schedules:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const getWorkScheduleById = async (id) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/${id}`, {
      headers: getAuthHeaders(),
    });
    return res.data.result;
  } catch (error) {
    console.error("Error fetching work schedule by ID:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const updateWorkSchedule = async (id, data) => {
  try {
    const res = await axios.put(`${API_BASE_URL}/${id}`, data, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
    });
    return res.data.result;
  } catch (error) {
    console.error("Error updating work schedule:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const deleteWorkSchedule = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    console.error("Error deleting work schedule:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const softDeleteWorkSchedule = async (id) => {
  try {
    const res = await axios.put(`${API_BASE_URL}/soft-delete/${id}`, null, {
      headers: getAuthHeaders(),
    });
    return res.data.result;
  } catch (error) {
    console.error("Error soft deleting work schedule:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const getSchedulesByEmployeeAndDateRange = async (employeeId, fromDate, toDate) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/range`, {
      headers: getAuthHeaders(),
      params: {
        employeeId,
        fromDate,
        toDate,
      },
    });
    return res.data.result || [];
  } catch (error) {
    console.error("Error fetching schedules by employee and date range:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const getEditableSchedules = async (employeeId, fromDate, toDate) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/editable`, {
      headers: getAuthHeaders(),
      params: {
        employeeId,
        fromDate,
        toDate,
      },
    });
    return res.data.result || [];
  } catch (error) {
    console.error("Error fetching editable schedules:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const approveOvertime = async (id) => {
  try {
    const res = await axios.put(`${API_BASE_URL}/approve-ot/${id}`, null, {
      headers: getAuthHeaders(),
    });
    return res.data.result;
  } catch (error) {
    console.error("Error approving overtime:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const getOvertimeSchedulesByStatus = async (employeeId, status) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/employee/${employeeId}/ot`, {
      headers: getAuthHeaders(),
      params: { status },
    });
    return res.data.result || [];
  } catch (error) {
    console.error("Error fetching overtime schedules by status:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const getOvertimeSchedulesFlexible = async (employeeId, status, fromDate, toDate) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/employee/${employeeId}/ot-by-status`, {
      headers: getAuthHeaders(),
      params: {
        status,
        fromDate,
        toDate,
      },
    });
    return res.data.result || [];
  } catch (error) {
    console.error("Error fetching flexible overtime schedules:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const getFilteredWorkSchedules = async (filters) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/filter`, {
      headers: getAuthHeaders(),
      params: filters,
    });
    return res.data.result || [];
  } catch (error) {
    console.error("Error fetching filtered schedules:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};
