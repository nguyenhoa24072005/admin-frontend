import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/auth'; // Đổi nếu cần

const AuthService = {
  login: async (loginRequest) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, loginRequest);
      return response.data; // ApiResponse<LoginResponse>
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return {
        code: 500,
        message: 'Lỗi kết nối đến máy chủ',
        errorCode: 'INTERNAL_SERVER_ERROR',
        success: false
      };
    }
  },
};

export default AuthService;
