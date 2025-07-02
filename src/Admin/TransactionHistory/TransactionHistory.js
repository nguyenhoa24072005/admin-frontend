import React, { useState, useEffect } from 'react';
import { getTransactionHistories, addTransactionHistory, updateTransactionHistory, deleteTransactionHistory } from '../ServiceAdmin/TransactionService';
import './TransactionHistory.css';

const AdminTransactionHistory = () => {
    const [transactionHistories, setTransactionHistories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [newTransactionHistory, setNewTransactionHistory] = useState({
        transactionId: '',
        donationId: '',
        transactionDate: '',
        transactionDetails: ''
    });
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [error, setError] = useState('');

    // Fetch transaction histories on initial load or search query change
    useEffect(() => {
        const fetchTransactionHistories = async () => {
            try {
                const data = await getTransactionHistories(searchQuery);
                const transactionList = data?.$values || [];
                setTransactionHistories(transactionList);
            } catch (error) {
                setError('Error fetching transaction histories.');
            }
        };

        fetchTransactionHistories();
    }, [searchQuery]);

    // Handle search query input
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Handle adding a new transaction history
    const handleAddTransaction = async () => {
        try {
            const transactionData = {
                transactionId: newTransactionHistory.transactionId,
                donationId: newTransactionHistory.donationId,
                transactionDate: newTransactionHistory.transactionDate,
                transactionDetails: newTransactionHistory.transactionDetails
            };
            await addTransactionHistory(transactionData);
            setNewTransactionHistory({
                transactionId: '',
                donationId: '',
                transactionDate: '',
                transactionDetails: ''
            });
            setSearchQuery(''); // Optionally reset search after adding
            alert('Transaction added successfully');
        } catch (error) {
            setError('Failed to add transaction history');
        }
    };

    // Handle updating a transaction history
    const handleUpdateTransaction = async (id) => {
        try {
            await updateTransactionHistory(id, selectedTransaction);
            setSelectedTransaction(null);
            alert('Transaction updated successfully');
        } catch (error) {
            setError('Failed to update transaction history');
        }
    };

    // Handle deleting a transaction history
    const handleDeleteTransaction = async (id) => {
        try {
            await deleteTransactionHistory(id);
            alert('Transaction deleted successfully');
        } catch (error) {
            setError('Failed to delete transaction history');
        }
    };

    return (
        <div className="admin-transaction-history-container">
            <h3 className="admin-transaction-history-header">Admin Transaction History</h3>
            {error && <p className="admin-error-message">{error}</p>}
            <div className="admin-search-container">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="admin-search-input"
                    placeholder="Search transactions..."
                />
            </div>

            <div className="admin-transaction-history-list">
                <h2 className="admin-transaction-history-list-header">Transaction Histories</h2>
                {transactionHistories.length > 0 ? (
                    <ul className="admin-transaction-history-list-items">
                        {transactionHistories.map((transaction) => (
                            <li key={transaction.transactionId} className="admin-transaction-history-item">
                                <div className="admin-transaction-history-item-details">
                                    <p>Transaction ID: {transaction.transactionId}</p>
                                    <p>Donation ID: {transaction.donationId}</p>
                                    <p>Transaction Date: {transaction.transactionDate}</p>
                                    <p>Details: {transaction.transactionDetails}</p>
                                </div>
                                <div className="admin-transaction-history-actions">
                                    <button
                                        onClick={() => setSelectedTransaction(transaction)}
                                        className="admin-edit-button"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteTransaction(transaction.transactionId)}
                                        className="admin-delete-button"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No transactions found</p>
                )}
            </div>

            <div className="admin-add-transaction-container">
                <h2 className="admin-add-transaction-header">Add New Transaction</h2>
                <input
                    type="text"
                    value={newTransactionHistory.transactionId}
                    onChange={(e) =>
                        setNewTransactionHistory({ ...newTransactionHistory, transactionId: e.target.value })
                    }
                    className="admin-input-field"
                    placeholder="Transaction ID"
                />
                <input
                    type="text"
                    value={newTransactionHistory.donationId}
                    onChange={(e) =>
                        setNewTransactionHistory({ ...newTransactionHistory, donationId: e.target.value })
                    }
                    className="admin-input-field"
                    placeholder="Donation ID"
                />
                <input
                    type="datetime-local"
                    value={newTransactionHistory.transactionDate}
                    onChange={(e) =>
                        setNewTransactionHistory({ ...newTransactionHistory, transactionDate: e.target.value })
                    }
                    className="admin-input-field"
                />
                <textarea
                    value={newTransactionHistory.transactionDetails}
                    onChange={(e) =>
                        setNewTransactionHistory({ ...newTransactionHistory, transactionDetails: e.target.value })
                    }
                    className="admin-input-field"
                    placeholder="Transaction Details"
                />
                <button onClick={handleAddTransaction} className="admin-add-button">
                    Add Transaction
                </button>
            </div>

            {selectedTransaction && (
                <div className="admin-update-transaction-container">
                    <h2 className="admin-update-transaction-header">Update Transaction</h2>
                    <input
                        type="text"
                        value={selectedTransaction.transactionId}
                        onChange={(e) =>
                            setSelectedTransaction({ ...selectedTransaction, transactionId: e.target.value })
                        }
                        className="admin-input-field"
                    />
                    <input
                        type="text"
                        value={selectedTransaction.donationId}
                        onChange={(e) =>
                            setSelectedTransaction({ ...selectedTransaction, donationId: e.target.value })
                        }
                        className="admin-input-field"
                    />
                    <input
                        type="datetime-local"
                        value={selectedTransaction.transactionDate}
                        onChange={(e) =>
                            setSelectedTransaction({ ...selectedTransaction, transactionDate: e.target.value })
                        }
                        className="admin-input-field"
                    />
                    <textarea
                        value={selectedTransaction.transactionDetails}
                        onChange={(e) =>
                            setSelectedTransaction({ ...selectedTransaction, transactionDetails: e.target.value })
                        }
                        className="admin-input-field"
                    />
                    <button onClick={() => handleUpdateTransaction(selectedTransaction.transactionId)} className="admin-update-button">
                        Update Transaction
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminTransactionHistory;
