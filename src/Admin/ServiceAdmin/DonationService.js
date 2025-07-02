import axios from 'axios';

const API_URL = 'https://charitynavigator-hma3agega6fwfgb2.canadacentral-01.azurewebsites.net/api/ProgramDonation/';
const CUSTOMER_API_URL = 'https://charitynavigator-hma3agega6fwfgb2.canadacentral-01.azurewebsites.net/api/Customer/';

// Utility function to get authorization headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('role');

    if (!token) {
        throw new Error('Authorization token is missing.');
    }

    if (!role) {
        throw new Error('User role is missing.');
    }

    return { headers: { Authorization: `Bearer ${token}` } };
};

// Fetch all Program Donations with an optional search query
const getProgramDonations = async (searchQuery = '') => {
    try {
        const response = await axios.get(API_URL, {
            params: { searchQuery },
            ...getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        handleAxiosError(error, 'Failed to fetch program donations');
    }
};

// Fetch a specific Program Donation by ID
const getProgramDonationById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}${id}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        handleAxiosError(error, `Failed to fetch program donation with ID ${id}`);
    }
};

// Add a new Program Donation
const addProgramDonation = async (donation) => {
    try {
        const response = await axios.post(API_URL, donation, getAuthHeaders());
        return response.data;
    } catch (error) {
        handleAxiosError(error, 'Failed to add program donation');
    }
};

// Update an existing Program Donation
const updateProgramDonation = async (id, updatedDonation) => {
    try {
        const response = await axios.put(`${API_URL}${id}`, updatedDonation, getAuthHeaders());
        return response.data;
    } catch (error) {
        handleAxiosError(error, `Failed to update program donation with ID ${id}`);
    }
};

// Delete a Program Donation
const deleteProgramDonation = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}${id}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        handleAxiosError(error, `Failed to delete program donation with ID ${id}`);
    }
};

// Fetch a specific Customer by ID
const getCustomerById = async (customerId) => {
    try {
        const response = await axios.get(`${CUSTOMER_API_URL}${customerId}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        handleAxiosError(error, `Customer with ID ${customerId} not found`);
    }
};

// Helper function to handle Axios errors
const handleAxiosError = (error, customMessage) => {
    console.error(customMessage, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || customMessage);
};

// Export all functions
export {
    getProgramDonations,
    getProgramDonationById,
    addProgramDonation,
    updateProgramDonation,
    deleteProgramDonation,
    getCustomerById,
};
