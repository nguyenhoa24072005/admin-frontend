import axios from "axios";

const API_BASE_URL = "https://hr-sem4-project-egcmcze0dmgwhdgb.eastasia-01.azurewebsites.net/api/notify";

const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("No auth token found. Please log in.");
  }
  return { Authorization: `Bearer ${token}` };
};

export const getNotifications = async (userId, role, page = 0, size = 10) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/received`, {
      headers: getAuthHeaders(),
      params: { userId, role, page, size },
    });
    return res.data || [];
  } catch (err) {
    console.error("API error in getNotifications:", err.response?.data || err.message);
    if (err.response?.status === 0) {
      throw new Error("CORS error: Unable to reach the server. Please check backend CORS configuration.");
    }
    throw new Error(err.response?.data?.message || err.message);
  }
};

export const pushToRoles = async (title, message, sentBy, roles) => {
  try {
    const payload = { title, message, sentBy, roles };
    const res = await axios.post(`${API_BASE_URL}/push-to-roles`, payload, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (err) {
    console.error("API error in pushToRoles:", err.response?.data || err.message);
    if (err.response?.status === 0) {
      throw new Error("CORS error: Unable to reach the server. Please check backend CORS configuration.");
    }
    throw new Error(err.response?.data?.message || err.message);
  }
};

export const pushToUser = async (userId, title, message, senderId) => {
  try {
    const payload = { userId, title, message, senderId,};
    const res = await axios.post(`${API_BASE_URL}/push-to-user`, payload, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (err) {
    console.error("API error in pushToUser:", err.response?.data || err.message);
    if (err.response?.status === 0) {
      throw new Error("CORS error: Unable to reach the server. Please check backend CORS configuration.");
    }
    throw new Error(err.response?.data?.message || err.message);
  }
};

export const pushToTopic = async (topic, title, message) => {
  try {
    const payload = { topic, title, message };
    const res = await axios.post(`${API_BASE_URL}/push-to-topic`, payload, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (err) {
    console.error("API error in pushToTopic:", err.response?.data || err.message);
    if (err.response?.status === 0) {
      throw new Error("CORS error: Unable to reach the server. Please check backend CORS configuration.");
    }
    throw new Error(err.response?.data?.message || err.message);
  }
};

export const markAsRead = async (userId, notificationId) => {
  try {
    const payload = { userId, notificationId };
    const res = await axios.post(`${API_BASE_URL}/mark-read`, payload, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (err) {
    console.error("API error in markAsRead:", err.response?.data || err.message);
    if (err.response?.status === 0) {
      throw new Error("CORS error: Unable to reach the server. Please check backend CORS configuration.");
    }
    throw new Error(err.response?.data?.message || err.message);
  }
};

export const markAllAsRead = async (userId, notificationIds) => {
  try {
    const payload = { userId, notificationIds };
    const res = await axios.post(`${API_BASE_URL}/mark-all-read`, payload, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (err) {
    console.error("API error in markAllAsRead:", err.response?.data || err.message);
    if (err.response?.status === 0) {
      throw new Error("CORS error: Unable to reach the server. Please check backend CORS configuration.");
    }
    throw new Error(err.response?.data?.message || err.message);
  }
};