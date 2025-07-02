import axios from 'axios';

const API_URL = 'https://charitynavigator-hma3agega6fwfgb2.canadacentral-01.azurewebsites.net/api/Invitation/'; // API endpoint cho InvitationController

// Hàm tiện ích để lấy headers xác thực
const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('role');

    if (!token) {
        throw new Error('Unauthorized: Missing authorization token.');
    }

    if (!role) {
        throw new Error('Unauthorized: Missing user role.');
    }

    return {
        headers: { Authorization: `Bearer ${token}` },
        role,
    };
};

// Lấy tất cả lời mời với tùy chọn tìm kiếm (Admin, User, NGO roles)
const getInvitations = async (searchQuery = '') => {
    const { headers, role } = getAuthHeaders();
    try {

        if (!['Admin', 'User', 'NGO'].includes(role)) {
            throw new Error('Unauthorized: Access restricted to Admin, User, and NGO roles.');
        }

        const response = await axios.get(API_URL, {
            params: { searchQuery },
            headers,
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching invitations:', error.response?.data || error.message);
        throw error;
    }
};

// Lấy thông tin chi tiết lời mời theo ID (Admin, User, NGO roles)
const getInvitationById = async (id) => {
    const { headers, role } = getAuthHeaders();
    try {

        if (!['Admin', 'User', 'NGO'].includes(role)) {
            throw new Error('Unauthorized: Access restricted to Admin, User, and NGO roles.');
        }

        const response = await axios.get(`${API_URL}${id}`, { headers });
        return response.data;
    } catch (error) {
        console.error(`Error fetching invitation with ID ${id}:`, error.response?.data || error.message);
        throw error;
    }
};

// Thêm lời mời mới (Admin, NGO roles)
const addInvitation = async (invitation) => {
    const { headers, role } = getAuthHeaders();
    try {

        if (!['Admin', 'NGO'].includes(role)) {
            throw new Error('Unauthorized: Only Admin and NGO roles can add invitations.');
        }

        console.log('Adding invitation:', invitation);
        const response = await axios.post(API_URL, invitation, { headers });
        return response.data;
    } catch (error) {
        console.error('Error adding invitation:', error.response?.data || error.message);
        throw error;
    }
};

// Cập nhật lời mời (Admin, NGO roles)
const updateInvitation = async (id, updatedInvitation) => {
    const { headers, role } = getAuthHeaders();
    try {
        if (!['Admin', 'NGO'].includes(role)) {
            throw new Error('Unauthorized: Only Admin and NGO roles can update invitations.');
        }

        // Ensure `id` is properly passed to the URL
        if (!id) {
            throw new Error('Invalid invitation ID.');
        }

        const response = await axios.put(`${API_URL}${id}`, updatedInvitation, { headers });
        return response.data;
    } catch (error) {
        console.error(`Error updating invitation with ID ${id}:`, error.response?.data || error.message);
        throw error;
    }
};


// Xóa lời mời (Admin role only)
const deleteInvitation = async (id) => {
    const { headers, role } = getAuthHeaders();
    try {

        if (role !== 'Admin') {
            throw new Error('Unauthorized: Only Admin can delete invitations.');
        }

        const response = await axios.delete(`${API_URL}${id}`, { headers });
        return response.data;
    } catch (error) {
        console.error(`Error deleting invitation with ID ${id}:`, error.response?.data || error.message);
        throw error;
    }
};

export {
    getInvitations,
    getInvitationById,
    addInvitation,
    updateInvitation,
    deleteInvitation,
};
