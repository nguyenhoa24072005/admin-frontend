import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/work-schedules";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("authToken")}`,
});

export const getWorkSchedules = async () => {
  const res = await axios.get(API_BASE_URL, { headers: getAuthHeaders() });
  return res.data.result;
};

export const createWorkSchedule = async (data) => {
  const res = await axios.post(API_BASE_URL, data, {
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
  });
  return res.data.result;
};

export const createBulkWorkSchedules = async (data) => {
  const res = await axios.post(`${API_BASE_URL}/bulk`, data, {
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
  });
  return res.data.result;
};

export const getWorkScheduleById = async (id) => {
  const res = await axios.get(`${API_BASE_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  return res.data.result;
};

export const updateWorkSchedule = async (id, data) => {
  const res = await axios.put(`${API_BASE_URL}/${id}`, data, {
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
  });
  return res.data.result;
};

export const deleteWorkSchedule = async (id) => {
  await axios.delete(`${API_BASE_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
};

export const softDeleteWorkSchedule = async (id) => {
  const res = await axios.put(`${API_BASE_URL}/soft-delete/${id}`, null, {
    headers: getAuthHeaders(),
  });
  return res.data.result;
};

export const getSchedulesByEmployeeAndDateRange = async (employeeId, fromDate, toDate) => {
  const res = await axios.get(`${API_BASE_URL}/range`, {
    headers: getAuthHeaders(),
    params: {
      employeeId,
      fromDate,
      toDate
    }
  });
  return res.data.result;
};

export const getEditableSchedules = async (employeeId, fromDate, toDate) => {
  const res = await axios.get(`${API_BASE_URL}/editable`, {
    headers: getAuthHeaders(),
    params: {
      employeeId,
      fromDate,
      toDate
    }
  });
  return res.data.result;
};

export const approveOvertime = async (id) => {
  const res = await axios.put(`${API_BASE_URL}/approve-ot/${id}`, null, {
    headers: getAuthHeaders(),
  });
  return res.data.result;
};

export const getOvertimeSchedulesByStatus = async (employeeId, status) => {
  const res = await axios.get(`${API_BASE_URL}/employee/${employeeId}/ot`, {
    headers: getAuthHeaders(),
    params: { status }
  });
  return res.data.result;
};

export const getOvertimeSchedulesFlexible = async (employeeId, status, fromDate, toDate) => {
  const res = await axios.get(`${API_BASE_URL}/employee/${employeeId}/ot-by-status`, {
    headers: getAuthHeaders(),
    params: {
      status,
      fromDate,
      toDate
    }
  });
  return res.data;
};