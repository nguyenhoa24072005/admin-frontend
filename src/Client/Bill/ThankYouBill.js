import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons"; // Import icon
import "./ThankYouBill.css";

const ThankYouBill = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state || !state.donationData) {
      const timer = setTimeout(() => {
        navigate("/"); // Redirect to home if no valid data
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state, navigate]);

  if (!state || !state.donationData) {
    return (
      <div className="thank-you-container">
        <p>Invalid data. Redirecting to home...</p>
      </div>
    );
  }

  const { donationData } = state;

  const goToHome = () => {
    navigate("/");
  };

  return (
    <div className="thank-you-container">
      <div className="thank-you-bro">
        <button onClick={goToHome} className="go-home-btn-icon">
          <FontAwesomeIcon icon={faHome} /> {/* Thay nút bằng icon */}
        </button>
        <div className="logo-charity">
          <img
            src="/images/Super thank you-bro.png"
            alt="Give-AID Logo"
            className="thank-you-logo"
          />
        </div>
        <div className="thank-you-header">
          <h1>Thank You!</h1>
          <p>Your donation helps us make a positive change.</p>
        </div>
        <div className="donation-details">
          <p>
            <span className="label">Donor:</span>
            <span className="value">{donationData.donorName}</span>
          </p>
          <p>
            <span className="label">Donor Email:</span>
            <span className="value">{donationData.donorEmail}</span>
          </p>
          <p>
            <span className="label">Organization:</span>
            <span className="value">Give-AID</span>
          </p>
          <p>
            <span className="label">Donation Amount:</span>
            <span className="value">{donationData.donationAmount} $</span>
          </p>
          <p>
            <span className="label">Donation Date:</span>
            <span className="value">{donationData.donationDate}</span>
          </p>
          <p>
            <span className="label">Payment Method:</span>
            <span className="value">{donationData.paymentMethod}</span>
          </p>
        </div>
        <div className="thank-you-note">
          <p>Thank you for trusting us, we wish you all the best.</p>
          <div className="thank-you-footer">
            <p>
              Visit{" "}
              <a
                href="https://give-aid.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Give-AID.org
              </a>{" "}
              to learn more about our activities.
            </p>
            <p>Once again, we sincerely thank you!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouBill;
