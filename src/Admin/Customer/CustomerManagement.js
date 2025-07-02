import React, { useState, useEffect } from 'react';
import {
    getAllCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    searchCustomers,
} from '../ServiceAdmin/CustomerService'; // Adjust the path if necessary
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiSearch } from "react-icons/fi";
import { FaUserPlus } from "react-icons/fa";
import './Customer.css';

const CustomerManagement = () => {
    const [customers, setCustomers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '' });
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const toggleForm = () => {
        setShowForm(!showForm);
    };


    const validateAuth = () => {
        const token = localStorage.getItem('authToken');
        const role = localStorage.getItem('role');
        if (!token || !role) {
            console.error('User is not authenticated.');
            // window.location.href = '/login'; // Redirect to login page
            return false;
        }
        return true;
    };

    const fetchCustomers = async () => {
        if (!validateAuth()) return; // Stop fetching if user is not authenticated
        try {
            const data = searchQuery
                ? await searchCustomers(searchQuery)
                : await getAllCustomers();
            const customerList = data?.$values || [];
            setCustomers(customerList);
        } catch (error) {
            console.error('Error fetching customers:', error.message);
        }
    };

    const handleAddCustomer = async () => {
        try {
            await addCustomer(newCustomer);
            setNewCustomer({ name: '', email: '', phone: '' });
            fetchCustomers();
        } catch (error) {
            console.error('Error adding customer:', error.message);
        }
    };

    const handleUpdateCustomer = async () => {
        try {
            if (!editingCustomer) return;
            await updateCustomer(editingCustomer.customerId, editingCustomer);
            setEditingCustomer(null);
            fetchCustomers();
        } catch (error) {
            console.error('Error updating customer:', error.message);
        }
    };

    const handleDeleteCustomer = async (id) => {
        try {
            await deleteCustomer(id);
            fetchCustomers();
        } catch (error) {
            console.error('Error deleting customer:', error.message);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, [searchQuery]);

    return (
        <div className="customer-management">
            {/* <h1>Customer Management</h1> */}
            <div className="search-column">
                <input className='search-field'
                    type="text"
                    placeholder="Search customers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <i className='customer-search'><FiSearch /></i>
                    <a className='customer-setbin' onClick={toggleForm}><FaUserPlus /></a>
            </div>

            <div className={`customer-form ${showForm ? 'show' : 'hide'}`}>
                <h2>{editingCustomer ? 'Edit Customer' : 'Add Customer'}</h2>
                <input
                    type="text"
                    placeholder="Name"
                    value={editingCustomer ? editingCustomer.name : newCustomer.name}
                    onChange={(e) =>
                        editingCustomer
                            ? setEditingCustomer({ ...editingCustomer, name: e.target.value })
                            : setNewCustomer({ ...newCustomer, name: e.target.value })
                    }
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={editingCustomer ? editingCustomer.email : newCustomer.email}
                    onChange={(e) =>
                        editingCustomer
                            ? setEditingCustomer({ ...editingCustomer, email: e.target.value })
                            : setNewCustomer({ ...newCustomer, email: e.target.value })
                    }
                />
                <input
                    type="tel"
                    placeholder="Phone"
                    value={editingCustomer ? editingCustomer.phone : newCustomer.phone}
                    onChange={(e) =>
                        editingCustomer
                            ? setEditingCustomer({ ...editingCustomer, phone: e.target.value })
                            : setNewCustomer({ ...newCustomer, phone: e.target.value })
                    }
                />
                <button onClick={editingCustomer ? handleUpdateCustomer : handleAddCustomer}>
                    {editingCustomer ? 'Update' : 'Add'}
                </button>
            </div>

            <div className="customer-list">
                <table className='customer-table'>
                    <thead className='customer-thead'> 
                        <tr className='customer-tr'>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className='customer-tbody'>
                        {customers.map((customer) => (
                            <tr key={customer.customerId}>
                                <td>{customer.customerId}</td>
                                <td>{`${customer.firstName} ${customer.lastName}`}</td>
                                <td>{customer?.account?.email || 'N/A'}</td>
                                <td>{customer.phoneNumber || 'N/A'}</td>
                                <td>
                                    <button className='customer-btn' onClick={() => setEditingCustomer(customer)}>
                                        <FiEdit />
                                    </button>
                                    <button className='customer-delete' onClick={() => handleDeleteCustomer(customer.customerId)}>
                                        <RiDeleteBin6Line />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CustomerManagement;
