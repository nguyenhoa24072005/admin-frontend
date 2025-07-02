import React, { useState, useEffect } from 'react';
import {
  getInvitations,
  addInvitation,
  updateInvitation,
  deleteInvitation,
} from '../ServiceAdmin/InvitationService';
import { FiEdit } from "react-icons/fi";
import { RiDeleteBinFill } from "react-icons/ri";
import './Invitation.css';
import { FaUserPlus } from "react-icons/fa6";

const InvitationAdmin = () => {
  const [invitations, setInvitations] = useState([]);
  const [currentInvitation, setCurrentInvitation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newInvitation, setNewInvitation] = useState({
    title: '',
    description: '',
    date: '',
    senderId: '',
    recipientEmail: '',
    message: '',
    status: 'Pending',
    sentAt: '',
  });
  const [error, setError] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false); // State to toggle form visibility

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const data = await getInvitations(searchQuery);
        const invitationList = data?.$values || [];
        setInvitations(invitationList);
      } catch (err) {
        setError('Failed to fetch invitations.');
      }
    };

    fetchInvitations();
  }, [searchQuery]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleAddInvitation = async () => {
    try {
      console.log("Payload:", newInvitation); // Log payload
      const invitation = await addInvitation(newInvitation);
      setInvitations([...invitations, invitation]);
      setNewInvitation({
        title: '',
        description: '',
        date: '',
        senderId: '',
        recipientEmail: '',
        message: '',
        status: 'Pending',
        sentAt: '',
      });
    } catch (err) {
      console.error("Error adding invitation:", err.response?.data || err);
      setError('Failed to add invitation.');
    }
  };

  const handleUpdateInvitation = async () => {
    if (!currentInvitation || !currentInvitation.InvitationId) {
      setError('Invitation ID is missing.');
      return;
    }
  
    try {
      const updatedInvitation = await updateInvitation(currentInvitation.InvitationId, currentInvitation);
      setInvitations(invitations.map((invitation) =>
        invitation.InvitationId === currentInvitation.InvitationId ? updatedInvitation : invitation
      ));
      setCurrentInvitation(null); // Reset form after update
    } catch (err) {
      setError('Failed to update invitation.');
    }
  };
  

  const handleDeleteInvitation = async (id) => {
    try {
      await deleteInvitation(id);
      setInvitations(invitations.filter((invitation) => invitation.InvitationId !== id));
    } catch (err) {
      setError('Failed to delete invitation.');
    }
  };

  // Toggle form visibility when the icon is clicked
  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  return (
    <div className="invitation-admin-container">
      <h1 className="invitation-admin-title">Invitation Management</h1>
      {error && <p className="error-message">{error}</p>}

      <div className="search-invitations">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search invitations"
          className="search-input1"
        />
        <a className='customer-setbin1' onClick={toggleFormVisibility}><FaUserPlus /></a> {/* Toggle form visibility */}
      </div>

      {/* Sliding form */}
      {isFormVisible && (
        <div className="add-invitation-form slide-down"> {/* Apply slide-down class to form */}
          <h2>Add New Invitation</h2>
          <input
            type="text"
            placeholder="Title"
            value={newInvitation.title}
            onChange={(e) => setNewInvitation({ ...newInvitation, title: e.target.value })}
          />
          <textarea
            placeholder="Description"
            value={newInvitation.description}
            onChange={(e) => setNewInvitation({ ...newInvitation, description: e.target.value })}
          />
          <input
            type="date"
            value={newInvitation.date}
            onChange={(e) => setNewInvitation({ ...newInvitation, date: e.target.value })}
          />
          <input
            type="text"
            placeholder="Sender ID"
            value={newInvitation.senderId}
            onChange={(e) => setNewInvitation({ ...newInvitation, senderId: e.target.value })}
          />
          <input
            type="email"
            placeholder="Recipient Email"
            value={newInvitation.recipientEmail}
            onChange={(e) => setNewInvitation({ ...newInvitation, recipientEmail: e.target.value })}
          />
          <textarea
            placeholder="Message"
            value={newInvitation.message}
            onChange={(e) => setNewInvitation({ ...newInvitation, message: e.target.value })}
          />
          <input
            type="text"
            placeholder="Status"
            value={newInvitation.status}
            onChange={(e) => setNewInvitation({ ...newInvitation, status: e.target.value })}
          />
          <input
            type="datetime-local"
            value={newInvitation.sentAt}
            onChange={(e) => setNewInvitation({ ...newInvitation, sentAt: e.target.value })}
          />
          <button onClick={handleAddInvitation}>Add Invitation</button>
        </div>
      )}

      <div className="invitation-list">
        {invitations.map((invitation) => (
          <div key={invitation.InvitationId} className="invitation-card">
            <h3 className="invitation-card-title">{invitation.title}</h3>
            {/* <p>{`Description: ${invitation.description}`}</p> */}
            {/* <p>{`Date: ${invitation.date}`}</p> */}
            <p>{`Sender ID: ${invitation.senderId}`}</p>
            <p>{`Recipient Email: ${invitation.recipientEmail}`}</p>
            <p>{`Message: ${invitation.message}`}</p>
            <p>{`Status: ${invitation.status}`}</p>
            <p>{`Sent At: ${invitation.sentAt}`}</p>
            <button className="edit-button1" onClick={() => setCurrentInvitation(invitation)}><FiEdit /></button>
            <button className="delete-button1" onClick={() => handleDeleteInvitation(invitation.InvitationId)}><RiDeleteBinFill /></button>
          </div>
        ))}
      </div>

      {currentInvitation && (
        <div className="edit-invitation-form">
          <h2>Edit Invitation</h2>
          <input
            type="text"
            placeholder="Title"
            value={currentInvitation.title}
            onChange={(e) => setCurrentInvitation({ ...currentInvitation, title: e.target.value })}
          />
          <textarea
            placeholder="Description"
            value={currentInvitation.description}
            onChange={(e) => setCurrentInvitation({ ...currentInvitation, description: e.target.value })}
          />
          <input
            type="date"
            value={currentInvitation.date}
            onChange={(e) => setCurrentInvitation({ ...currentInvitation, date: e.target.value })}
          />
          <input
            type="text"
            placeholder="Sender ID"
            value={currentInvitation.senderId}
            onChange={(e) => setCurrentInvitation({ ...currentInvitation, senderId: e.target.value })}
          />
          <input
            type="email"
            placeholder="Recipient Email"
            value={currentInvitation.recipientEmail}
            onChange={(e) => setCurrentInvitation({ ...currentInvitation, recipientEmail: e.target.value })}
          />
          <textarea
            placeholder="Message"
            value={currentInvitation.message}
            onChange={(e) => setCurrentInvitation({ ...currentInvitation, message: e.target.value })}
          />
          <input
            type="text"
            placeholder="Status"
            value={currentInvitation.status}
            onChange={(e) => setCurrentInvitation({ ...currentInvitation, status: e.target.value })}
          />
          <input
            type="datetime-local"
            value={currentInvitation.sentAt}
            onChange={(e) => setCurrentInvitation({ ...currentInvitation, sentAt: e.target.value })}
          />
          <button onClick={handleUpdateInvitation}>Update Invitation</button>
        </div>
      )}
    </div>
  );
};

export default InvitationAdmin;
