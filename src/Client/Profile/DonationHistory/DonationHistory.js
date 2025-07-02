import React from "react";
import { Link } from "react-router-dom";
import "./DonationHistory.css";

const DonationHistory = ({ donations }) => {
  return (
    <div className="donation-history">
      <h3>Donation History</h3>
      {donations.length > 0 ? (
        <ul>
          {donations.map((donation, index) => (
            <li key={index}>
              {donation.date} - {donation.amount}
            </li>
          ))}
        </ul>
      ) : (
        <p>No donation history available.</p>
      )}
    </div>
  );
};

export default DonationHistory;
