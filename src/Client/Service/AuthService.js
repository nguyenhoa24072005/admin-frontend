import axios from 'axios';

const API_BASE_URL = 'https://hr-sem4-project-egcmcze0dmgwhdgb.eastasia-01.azurewebsites.net/api/auth'; // Đổi nếu cần

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
