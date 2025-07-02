import React, { useState, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import {
  FaBullseye,
  FaHandHoldingHeart,
  FaClock,
  FaUsers,
  FaCalendarAlt,
} from "react-icons/fa";
import { AiOutlineDollarCircle } from "react-icons/ai";
import "./Donate.css";
import { GoOrganization } from "react-icons/go";
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";

const Donate = () => {
  const { ngoId, programId } = useParams();
  const { auth } = useAuth();
  const [program, setProgram] = useState(null);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [customerId, setCustomerId] = useState(null);
  const [isPaymentSelected, setIsPaymentSelected] = useState(false);

  const navigate = useNavigate(); // Use the new useNavigate hook

  useEffect(() => {
    if (!auth.token) {
      navigate("/login"); // Redirect to login if not authenticated
      return;
    }
    if (!programId) {
      console.error("Program ID is missing.");
      navigate("/error"); // Redirect to an error page
      return;
    }

    fetchProgram();
    fetchCustomerId();
  }, [programId, auth.token, navigate]); // Add navigate to dependencies

  const fetchProgram = async () => {
    try {
      const response = await axios.get(
        `https://charitynavigator-hma3agega6fwfgb2.canadacentral-01.azurewebsites.net/api/program1/${programId}`
      );
      setProgram(response.data);
    } catch (err) {
      console.error("Failed to fetch program details.");
    }
  };

  const fetchCustomerId = async () => {
    try {
      const response = await axios.get(
        "https://charitynavigator-hma3agega6fwfgb2.canadacentral-01.azurewebsites.net/api/customer/get-customer-data",
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      setCustomerId(response.data.customerId);
    } catch (err) {
      console.error("Failed to fetch customer details.");
    }
  };

  const handleAmountChange = (e) => {
    const value = parseFloat(e.target.value) || "";
    if (value < 0) {
      setError("Amount must be greater than zero.");
    } else {
      setError("");
    }
    setAmount(value);
  };
  const handleSuccess = async (details) => {
    try {
      await axios.post(
        "https://charitynavigator-hma3agega6fwfgb2.canadacentral-01.azurewebsites.net/api/ProgramDonation",
        {
          programId,
          customerId,
          amount,
          paymentStatus: "Completed",
          transactionId: details.id,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      // Chuẩn bị dữ liệu cho trang ThankYouBill
      const donationData = {
        donorName: "John Doe", // Cần thay bằng dữ liệu thực tế của người dùng
        donorEmail: "john.doe@example.com", // Cần thay bằng dữ liệu thực tế
        donationAmount: amount.toFixed(2),
        donationDate: new Date().toLocaleDateString(),
        paymentMethod: "PayPal",
      };

      navigate("/thank-you-bill", { state: { donationData } });
    } catch (err) {
      console.error("Donation processing failed.");
      alert("Donation processing failed. Please try again.");
    }
  };

  const calculateDonationDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate || new Date());
    return Math.ceil((end - start) / (1000 * 3600 * 24));
  };

  const calculateRemainingDays = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const remainingTime = end - today;

    // Ensure the remaining days are not negative
    return remainingTime > 0
      ? Math.ceil(remainingTime / (1000 * 3600 * 24))
      : 0;
  };

  const getUniqueDonorsCount = (donations) => {
    const donationsArray = donations?.$values || [];
    const donorIds = donationsArray.map((donation) => donation.customerId);
    return new Set(donorIds).size;
  };

  if (!program) return <div className="loading">Loading...</div>;

  const totalDonationDays = calculateDonationDays(
    program.startDate,
    program.endDate
  );
  const remainingDonationDays = calculateRemainingDays(program.endDate);
  const organizationName = program.ngo?.name || "No organization";
  const percentageAchieved =
    program.targetAmount > 0
      ? Math.min((program.totalDonatedAmount / program.targetAmount) * 100, 100)
      : 0;

  const handleViewDonations = () => {
    if (programId && program.ngoId) {
      navigate(`/ngo/${program.ngoId}/program/${programId}/donations`);
    } else {
      console.error("Missing programId or ngoId");
    }
  };

  return (
    <PayPalScriptProvider
      options={{
        "client-id":
          "Aav1YKJFkaHRupG_cEWkSfWU0PhNiXEh0ejGI_0lstFJDzEQRvk-TQ9CzhdMytp_03I1JWJozf_YNSdd",
        currency: "USD",
      }}
    >
      <Header />
      <div className="favorites-banner11">
        <h1>Donate</h1>
      </div>
      <div className="donate-container">
        <div className="target-progress">
          <h1 className="donate-title">
            <FaBullseye /> {program.name || "No name available."}
          </h1>
          <p className="donate-description">
            <GoOrganization /> {organizationName}
          </p>
          <p className="donate-description">
            <FaHandHoldingHeart />{" "}
            {program.description || "No description available."}
          </p>
          <p className="target-amount">
            <AiOutlineDollarCircle /> Target:{" "}
            {program.targetAmount?.toFixed(2) || "0.00"}
          </p>
          <p className="total-donated">
            <FaHandHoldingHeart /> Total Donated:{" "}
            {program.totalDonatedAmount?.toFixed(2) || "0.00"}
          </p>
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{ width: `${percentageAchieved}%` }}
            ></div>
          </div>

          <p className="progress-percentage">
            Percentage Achieved: {percentageAchieved.toFixed(2)}%
          </p>
          {program.excessAmount > 0 && (
            <p className="excess-amount">
              Excess Amount: ${program.excessAmount.toFixed(2)}
            </p>
          )}

          <div className="donation-stats">
            <div
              className="stat-box"
              onClick={handleViewDonations}
              style={{ cursor: "pointer" }}
            >
              <FaUsers className="icon" />
              <span className="stat-label">Total Donors:</span>
              <span className="stat-value">
                {getUniqueDonorsCount(program.donations)}
              </span>
            </div>
            <div className="stat-box">
              <FaClock className="icon" />
              <span className="stat-label">Total Days of Donation:</span>
              <span className="stat-value">{totalDonationDays}</span>
            </div>
            <div className="stat-box">
              <FaCalendarAlt className="icon" />
              <span className="stat-label">Current Date:</span>
              <span className="stat-value">
                {new Date().toLocaleDateString()}
              </span>
            </div>
            <div className="stat-box">
              <FaCalendarAlt className="icon" />
              <span className="stat-label">Donation End Date:</span>
              <span className="stat-value">
                {new Date(program.endDate).toLocaleDateString()}
              </span>
            </div>
            <div className="stat-box">
              <FaClock className="icon" />
              <span className="stat-label">Remaining Days:</span>
              <span className="stat-value">{remainingDonationDays}</span>
            </div>
          </div>
        </div>

        {program.status === "" ? (
          <div className="completed-message">
            <img
              src="/images/Completed-bro.png"
              alt=" donate-completed"
              className="donate-completed"
            />{" "}
          </div>
        ) : (
          <>
            <div className="donate-paypal">
              <div className="donation-input-section">
                {isPaymentSelected && (
                  <>
                    <input
                      type="number"
                      value={amount}
                      onChange={handleAmountChange}
                      placeholder="Enter amount"
                      min="0.01"
                      step="0.01"
                      className="donation-amount-input"
                    />
                    {error && <p className="error-message">{error}</p>}
                  </>
                )}
              </div>
              {isPaymentSelected && amount > 0 && !error && (
                <PayPalButtons
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [
                        { amount: { value: amount.toString() } },
                      ],
                    });
                  }}
                  onApprove={(data, actions) => {
                    return actions.order.capture().then(handleSuccess);
                  }}
                  onError={(err) => {
                    console.error("PayPal transaction error: ", err);
                    alert(
                      "An error occurred during the transaction. Please try again."
                    );
                  }}
                />
              )}
              <div className="payment-button">
                <button onClick={() => setIsPaymentSelected(true)}>
                  Donate Now
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </PayPalScriptProvider>
  );
};

export default Donate;
