import axios from "axios";

const API_URL = "https://charitynavigator-hma3agega6fwfgb2.canadacentral-01.azurewebsites.net/api/accounts";

// Lấy danh sách tất cả tài khoản
export const getAccounts = async () => {
    const response = await axios.get(`${API_URL}`);
    return response.data;
};

// Lấy chi tiết một tài khoản theo ID
export const getAccountById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

// Thêm tài khoản mới
export const addAccount = async (data) => {
    const response = await axios.post(`${API_URL}`, data);
    return response.data;
};

// Cập nhật tài khoản theo ID
export const updateAccount = async (id, data) => {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
};

// Xóa tài khoản theo ID
export const deleteAccount = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};
