import React, { useState, useEffect } from "react";
import {
  getNotifications,
  pushToRoles,
  pushToUser,
  pushToTopic,
  markAsRead,
  markAllAsRead,
} from "../Service/notificationService";
import PushToUserForm from "./PushToUserForm";
import PushNotificationForm from "./PushNotificationForm";
import "./Notification.css"
import { FaPaperPlane, FaCheck, FaCheckDouble, FaTimes, FaArrowLeft, FaArrowRight } from "react-icons/fa";

const Notification = ({ userId, role }) => {
  const [notifications, setNotifications] = useState([]);
  const [activeFormTab, setActiveFormTab] = useState("user"); // 'user' hoặc 'notification'
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSendForm, setShowSendForm] = useState(false);
  const [sendType, setSendType] = useState("roles");
  const [form, setForm] = useState({
    title: "",
    message: "",
    roles: [],
    userId: "",
    topic: "",
    sentBy: userId || "system",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;
  const validRoles = ["Admin", "Hr", "User"];

  const normalizeRole = (role) => {
    if (!role) return null;
    const roleLower = role.toLowerCase();
    return validRoles.find((r) => r.toLowerCase() === roleLower) || null;
  };

  const loadNotifications = async () => {
    if (!userId || !role) {
      setError("User ID or role is missing");
      return;
    }

    const normalizedRole = normalizeRole(role);
    if (!normalizedRole) {
      setError("Invalid role provided");
      return;
    }

    setLoading(true);
    try {
      const data = await getNotifications(userId, normalizedRole, currentPage - 1, itemsPerPage);
      setNotifications(Array.isArray(data) ? data : []);
      setTotalPages(data.length < itemsPerPage ? currentPage : currentPage + 1);
      setError(null);
    } catch (err) {
      console.error("Failed to load notifications:", err);
      setError(`Failed to load notifications: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Loading notifications for:", { userId, role: normalizeRole(role), currentPage });
    loadNotifications();
  }, [userId, role, currentPage]);

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      if (sendType === "roles") {
        if (!form.roles.length) throw new Error("At least one role is required");
        const normalizedRoles = form.roles.map(normalizeRole).filter(Boolean);
        if (!normalizedRoles.length) throw new Error("Invalid roles provided");
        await pushToRoles(form.title, form.message, form.sentBy, normalizedRoles);
      } else if (sendType === "user") {
        if (!form.userId) throw new Error("User ID is required");
        await pushToUser(form.userId, form.title, form.message);
      } else if (sendType === "topic") {
        if (!form.topic) throw new Error("Topic is required");
        await pushToTopic(form.topic, form.title, form.message);
      }
      setShowSendForm(false);
      setForm({ title: "", message: "", roles: [], userId: "", topic: "", sentBy: userId || "system" });
      loadNotifications();
      alert("Notification sent successfully");
    } catch (err) {
      console.error("Failed to send notification:", err);
      alert(`Failed to send notification: ${err.message}`);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(userId, notificationId);
      loadNotifications();
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      alert(`Failed to mark notification as read: ${err.message}`);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadIds = notifications
        .filter((n) => !n.isRead)
        .map((n) => n.id);
      if (unreadIds.length === 0) {
        alert("No unread notifications to mark");
        return;
      }
      await markAllAsRead(userId, unreadIds);
      loadNotifications();
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
      alert(`Failed to mark all notifications as read: ${err.message}`);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "roles") {
      setForm((prev) => ({
        ...prev,
        roles: Array.from(e.target.selectedOptions, (option) => option.value),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const maxVisiblePages = 5;
  const pageNumbers = [];
  const ellipsis = "...";

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    const startPage = Math.max(2, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);
    pageNumbers.push(1);
    if (startPage > 2) {
      pageNumbers.push(ellipsis);
    }
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    if (endPage < totalPages - 1) {
      pageNumbers.push(ellipsis);
    }
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
  }

  return (
    <div className="WorkScheduleContainer">
      <h2>Notifications</h2>
      {loading && (
        <div className="WorkScheduleLoading">
          Loading notifications...
        </div>
      )}

      <div className="WorkScheduleControls">
        {(normalizeRole(role) === "Admin" || normalizeRole(role) === "Hr") && (
          <button
            className="WorkScheduleAddButton"
            onClick={() => setShowSendForm(true)}
          >
            <FaPaperPlane style={{ marginRight: 6 }} />
            Send Notification
          </button>
        )}

      </div>

      <div className="FormSwitchButtons" style={{ marginBottom: "10px" }}>
  <button
    onClick={() => {setActiveFormTab("user"); setShowSendForm(true);}}
    className={activeFormTab === "user" ? "active" : ""}
    style={{ marginRight: "8px" }}
  >
    Push To User
  </button>
  <button
    onClick={() => {setActiveFormTab("notification"); setShowSendForm(true);}}
    className={activeFormTab === "notification" ? "active" : ""}
  >
    Push To Roles / Topic
  </button>
</div>

      {showSendForm && (
        <>
          <div
            className="WorkScheduleOverlay"
            onClick={() => setShowSendForm(false)}
          />
          <div className="WorkScheduleModal">
            {activeFormTab === "user" ? (
              <PushToUserForm onClose={() => setShowSendForm(false)} />
            ) : (
              <PushNotificationForm
                defaultSender={userId}
                onClose={() => setShowSendForm(false)}
              />
            )}
          </div>
        </>
      )}

      <table className="WorkScheduleTable">

        <tbody>
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <tr key={n.id}>
                <td>{n.id}</td>
                <td>{n.title}</td>
                <td>{n.message}</td>
                <td>{n.sentBy || "System"}</td>
                <td>{n.sentAt ? new Date(n.sentAt).toLocaleString() : "N/A"}</td>
                <td className={`WorkScheduleStatus ${n.isRead ? "Read" : "Unread"}`}>
                  {n.isRead ? "Read" : "Unread"}
                </td>
                <td>
                  {!n.isRead && (
                    <button
                      className="WorkScheduleEditButton"
                      onClick={() => handleMarkAsRead(n.id)}
                    >
                      <FaCheck style={{ marginRight: 4 }} />
                      Mark as Read
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
          
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="PaginationControls">
          <button
            className="PaginationButton"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FaArrowLeft style={{ marginRight: 6 }} />
            Previous
          </button>
          <div className="PaginationNumbers">
            {pageNumbers.map((page, index) =>
              page === ellipsis ? (
                <span key={`ellipsis-${index}`} className="PaginationEllipsis">
                  {ellipsis}
                </span>
              ) : (
                <button
                  key={page}
                  className={`PaginationNumber ${
                    currentPage === page ? "active" : ""
                  }`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              )
            )}
          </div>
          <button
            className="PaginationButton"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <FaArrowRight style={{ marginLeft: 6 }} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Notification;