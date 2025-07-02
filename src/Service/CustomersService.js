import axios from "axios";

// Đặt URL cơ bản của API (Thay đổi nếu cần)
const API_BASE_URL = "https://charitynavigator-hma3agega6fwfgb2.canadacentral-01.azurewebsites.net/api/customers";

// Tạo các hàm gọi API
const CustomerService = {
  // Lấy danh sách tất cả khách hàng
  getAllCustomers: async () => {
    try {
      const response = await axios.get(API_BASE_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Thêm token xác thực nếu cần
        },
      });
      return response.data; // Dữ liệu khách hàng
    } catch (error) {
      console.error("Error fetching customers:", error);
      throw error;
    }
  },

  // Lấy thông tin chi tiết khách hàng theo ID
  getCustomerById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Thêm token xác thực nếu cần
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching customer with ID ${id}:`, error);
      throw error;
    }
  },

  // Cập nhật thông tin khách hàng
  updateCustomer: async (id, customerData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, customerData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data; // Thông báo cập nhật thành công
    } catch (error) {
      console.error(`Error updating customer with ID ${id}:`, error);
      throw error;
    }
  },

  // Xóa khách hàng
  deleteCustomer: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data; // Thông báo xóa thành công
    } catch (error) {
      console.error(`Error deleting customer with ID ${id}:`, error);
      throw error;
    }
  },
};

export default CustomerService;
