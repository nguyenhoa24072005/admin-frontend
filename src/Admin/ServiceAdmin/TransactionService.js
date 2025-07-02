import axios from 'axios';

const API_URL = 'https://charitynavigator-hma3agega6fwfgb2.canadacentral-01.azurewebsites.net/api/TransactionHistory/'; // Base URL for the TransactionHistoryController

// Utility function to get token and role
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

// Get all TransactionHistories with optional search query (Admin, User, and NGO roles)
const getTransactionHistories = async (searchQuery = '') => {
    const { token, headers } = getAuthHeaders();
    
    try {
        const response = await axios.get(API_URL, {
            params: { searchQuery },
            headers,
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch transaction histories:', error.response?.data || error.message);
        throw error;
    }
};

// Get TransactionHistory by ID (Admin, User, and NGO roles)
const getTransactionHistoryById = async (id) => {
    const { token, headers } = getAuthHeaders();
    
    try {
        const response = await axios.get(`${API_URL}${id}`, { headers });
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch transaction history with ID ${id}:`, error.response?.data || error.message);
        throw error;
    }
};

// Add a new TransactionHistory (Admin and NGO roles)
const addTransactionHistory = async (transactionHistory) => {
    const { token, headers } = getAuthHeaders();

    try {
        const response = await axios.post(API_URL, transactionHistory, {
            headers: {
                ...headers,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to add transaction history:', error.response?.data || error.message);
        throw error;
    }
};

// Update a TransactionHistory (Admin and NGO roles)
const updateTransactionHistory = async (id, updatedTransactionHistory) => {
    const { token, headers } = getAuthHeaders();

    try {
        const response = await axios.put(`${API_URL}${id}`, updatedTransactionHistory, {
            headers: {
                ...headers,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to update transaction history with ID ${id}:`, error.response?.data || error.message);
        throw error;
    }
};

// Delete a TransactionHistory (Admin role only)
const deleteTransactionHistory = async (id) => {
    const { token, headers } = getAuthHeaders();

    try {
        const response = await axios.delete(`${API_URL}${id}`, { headers });
        return response.data;
    } catch (error) {
        console.error(`Failed to delete transaction history with ID ${id}:`, error.response?.data || error.message);
        throw error;
    }
};

export {
    getTransactionHistories,
    getTransactionHistoryById,
    addTransactionHistory,
    updateTransactionHistory,
    deleteTransactionHistory,
};
