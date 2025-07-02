import axios from "axios";

const API_URL = "http://localhost:5024/api/Customer/"; // Adjusted to match the CustomerController route

// Utility function to get token and role
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("role");

  if (!token) {
    console.error("Authorization token is missing.");
    throw new Error("Unauthorized: Missing authorization token.");
  }

  if (!role) {
    console.error("User role is missing.");
    throw new Error("Unauthorized: Missing user role.");
  }

  return { token, role, headers: { Authorization: `Bearer ${token}` } };
};

// Fetch all customers (Admin only)
const getAllCustomers = async () => {
  const { token, role, headers } = getAuthHeaders();
  console.log("Role and Token:", { role, token });

  if (role !== "Admin") {
    console.error("Unauthorized: Only admins can fetch customers.");
    throw new Error("Unauthorized: Only admins can fetch customers.");
  }

  try {
    const response = await axios.get(`${API_URL}all`, { headers });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching customers:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Add a new customer (Admin only)
const addCustomer = async (customer) => {
  const { role, headers } = getAuthHeaders();
  if (role !== "Admin") {
    throw new Error("Unauthorized: Only admins can add customers.");
  }

  try {
    const response = await axios.post(API_URL, customer, { headers });
    return response.data;
  } catch (error) {
    console.error(
      "Error adding customer:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Update an existing customer (Admin only)
const updateCustomer = async (id, updatedCustomer) => {
  const { role, headers } = getAuthHeaders();
  if (role !== "Admin") {
    throw new Error("Unauthorized: Only admins can update customers.");
  }

  try {
    const response = await axios.put(`${API_URL}${id}`, updatedCustomer, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error updating customer with ID ${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// Delete a customer (Admin only)
const deleteCustomer = async (id) => {
  const { role, headers } = getAuthHeaders();
  if (role !== "Admin") {
    throw new Error("Unauthorized: Only admins can delete customers.");
  }

  try {
    const response = await axios.delete(`${API_URL}${id}`, { headers });
    return response.data;
  } catch (error) {
    console.error(
      `Error deleting customer with ID ${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// Get a specific customer by ID (Admin and User)
const getCustomerById = async (id) => {
  const { role, headers } = getAuthHeaders();
  if (!["Admin", "User"].includes(role)) {
    throw new Error("Unauthorized: Access is restricted to Admins and Users.");
  }

  try {
    const response = await axios.get(`${API_URL}${id}`, { headers });
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching customer with ID ${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// Search for customers with an optional query (Admin and User)
const searchCustomers = async (searchQuery = "") => {
  const { role, headers } = getAuthHeaders();
  if (!["Admin", "User"].includes(role)) {
    throw new Error("Unauthorized: Access is restricted to Admins and Users.");
  }

  try {
    const response = await axios.get(API_URL, {
      params: { searchQuery },
      headers,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error searching customers:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export {
  getAllCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerById,
  searchCustomers,
};
