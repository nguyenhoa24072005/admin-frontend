import axios from 'axios';

const API_URL = 'http://localhost:5024/api/Partner/'; // API URL for PartnerController

// Utility function to get authentication headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('role');

    if (!token) {
        console.error('Authorization token is missing.');
        throw new Error('Unauthorized: Missing authorization token.');
    }

    if (!role) {
        console.error('User role is missing.');
        throw new Error('Unauthorized: Missing user role.');
    }

    return { token, role, headers: { Authorization: `Bearer ${token}` } };
};

// Fetch all Partners (Admin, User, and NGO roles)
const getPartners = async (searchQuery = '') => {
    const { role, headers } = getAuthHeaders();

    if (!['Admin', 'User', 'NGO'].includes(role)) {
        throw new Error('Unauthorized: Access is restricted to Admins, Users, and NGOs.');
    }

    try {
        const response = await axios.get(API_URL, {
            params: { searchQuery },
            headers,
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch Partners:', error.response?.data || error.message);
        throw error;
    }
};

// Get Partner by ID (Admin, User, and NGO roles)
const getPartnerById = async (id) => {
    const { role, headers } = getAuthHeaders();

    if (!['Admin', 'User', 'NGO'].includes(role)) {
        throw new Error('Unauthorized: Access is restricted to Admins, Users, and NGOs.');
    }

    try {
        const response = await axios.get(`${API_URL}${id}`, { headers });
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch Partner with ID ${id}:`, error.response?.data || error.message);
        throw error;
    }
};

// Add Partner (Admin role only)
const addPartner = async (partner) => {
    const { role, headers } = getAuthHeaders();

    if (role !== 'Admin') {
        throw new Error('Unauthorized: Only Admins can add Partners.');
    }

    try {
        const response = await axios.post(API_URL, partner, { headers });
        return response.data;
    } catch (error) {
        console.error('Failed to add Partner:', error.response?.data || error.message);
        throw error;
    }
};

// Update Partner (Admin and NGO roles)
const updatePartner = async (id, updatedPartner) => {
    const { role, headers } = getAuthHeaders();

    if (!['Admin', 'NGO'].includes(role)) {
        throw new Error('Unauthorized: Only Admins and NGOs can update Partner information.');
    }

    console.log('Updating Partner with ID:', id);

    if (!id) {
        console.error('Partner ID is missing.');
        throw new Error('Partner ID is missing.');
    }

    try {
        const response = await axios.put(`${API_URL}${id}`, updatedPartner, { headers });
        return response.data;
    } catch (error) {
        console.error(`Failed to update Partner with ID ${id}:`, error.response?.data || error.message);
        throw error;
    }
};

// Delete Partner (Admin role only)
const deletePartner = async (id) => {
    const { role, headers } = getAuthHeaders();

    if (role !== 'Admin') {
        throw new Error('Unauthorized: Only Admins can delete Partners.');
    }

    try {
        const response = await axios.delete(`${API_URL}${id}`, { headers });
        return response.data;
    } catch (error) {
        console.error(`Failed to delete Partner with ID ${id}:`, error.response?.data || error.message);
        throw error;
    }
};

export {
    getPartners,
    getPartnerById,
    addPartner,
    updatePartner,
    deletePartner,
};
