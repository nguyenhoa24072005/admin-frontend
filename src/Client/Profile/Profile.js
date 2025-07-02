import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaVenusMars,
  FaClock,
  FaHandsHelping,
  FaQuestionCircle,
} from "react-icons/fa";
import "./Profile.css";
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";

const CustomerData = () => {
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Authentication token is missing");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `https://charitynavigator-hma3agega6fwfgb2.canadacentral-01.azurewebsites.net/api/customer/get-customer-data`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCustomerData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching customer data:", err);
        setError("Failed to load customer data");
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, []);

  if (loading) {
    return <div className="customer-loading">Loading...</div>;
  }

  if (error) {
    return <div className="customer-error">{error}</div>;
  }

  return (
    <div className="customer-data">
      <Header />
      <h2 className="customer-title">Customer Information</h2>

      <div className="customer-Profile">
        <div className="customer-data-container">
          <div className="customer-grid">
            <div className="customer-item">
              <div className="icon-container">
                <FaUser className="icon" />
              </div>
              <div className="customer-info">
                <strong>First Name:</strong> {customerData.firstName}
              </div>
            </div>
            <div className="customer-item">
              <div className="icon-container">
                <FaUser className="icon" />
              </div>
              <div className="customer-info">
                <strong>Last Name:</strong> {customerData.lastName}
              </div>
            </div>
            <div className="customer-item">
              <div className="icon-container">
                <FaUser className="icon" />
              </div>
              <div className="customer-info">
                <strong>Customer ID:</strong> {customerData.customerId}
              </div>
            </div>

            <div className="customer-item">
              <div className="icon-container">
                <FaBirthdayCake className="icon" />
              </div>
              <div className="customer-info">
                <strong>Date of Birth:</strong>{" "}
                {new Date(customerData.dateOfBirth).toLocaleDateString()}
              </div>
            </div>
            <div className="customer-item">
              <div className="icon-container">
                <FaPhone className="icon" />
              </div>
              <div className="customer-info">
                <strong>Phone Number:</strong>{" "}
                {customerData.phoneNumber || "Not provided"}
              </div>
            </div>
            <div className="customer-item">
              <div className="icon-container">
                <FaMapMarkerAlt className="icon" />
              </div>
              <div className="customer-info">
                <strong>Address:</strong>{" "}
                {customerData.address || "Not provided"}
              </div>
            </div>
            <div className="customer-item">
              <div className="icon-container">
                <FaVenusMars className="icon" />
              </div>
              <div className="customer-info">
                <strong>Gender:</strong> {customerData.gender}
              </div>
            </div>
            <div className="customer-item">
              <div className="icon-container">
                <FaClock className="icon" />
              </div>
              <div className="customer-info">
                <strong>Created At:</strong>{" "}
                {new Date(customerData.createdAt).toLocaleString()}
              </div>
            </div>
            <div className="customer-item">
              <div className="icon-container">
                <FaClock className="icon" />
              </div>
              <div className="customer-info">
                <strong>Updated At:</strong>{" "}
                {new Date(customerData.updatedAt).toLocaleString()}
              </div>
            </div>
            <div className="customer-item">
              <div className="icon-container">
                <FaHandsHelping className="icon" />
              </div>
              <div className="customer-info">
                <strong>Program Donations:</strong>{" "}
                {customerData.programDonations?.$values?.length ||
                  "No donations"}
              </div>
            </div>
            <div className="customer-item">
              <div className="icon-container">
                <FaQuestionCircle className="icon" />
              </div>
              <div className="customer-info">
                <strong>Queries:</strong>{" "}
                {customerData.queries?.$values?.length || "No queries"}
              </div>
            </div>
          </div>
        </div>
        <img
          src="/images/Resume-bro.png"
          alt="404 Not Found"
          className="Profile-image"
        />
      </div>
      <Footer />
    </div>
  );
};

export default CustomerData;
