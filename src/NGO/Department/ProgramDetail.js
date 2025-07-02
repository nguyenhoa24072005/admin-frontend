import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // For accessing URL params and navigation
import { getProgramById } from "../Service/programService"; // Function to fetch program data
import {
  FaBullseye,
  FaHandHoldingHeart,
  FaClock,
  FaUsers,
  FaCalendarAlt,
} from "react-icons/fa";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { GoOrganization } from "react-icons/go";
import "./ProgramDetail.css";
import { getProgramDonationsForNGOAndProgram } from "../Service/programDonationService";

const ProgramDetail = () => {
  const { id } = useParams(); // Get the program ID from the URL
  const { ngoId, programId } = useParams();
  const [program, setProgram] = useState(null); // State to hold program data
  const navigate = useNavigate(); // Hook for navigation

  // Fetch program details when the component loads or when the ID changes
  useEffect(() => {
    const fetchProgramDetails = async () => {
      try {
        const data = await getProgramById(id); // Fetch program by ID
        setProgram(data); // Update the state with fetched data
      } catch (error) {
        console.error("Error fetching program details:", error);
      }
    };
    fetchProgramDetails();
  }, [id]);

  // Utility to calculate the total number of donation days
  const calculateDonationDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate || new Date());
    return Math.ceil((end - start) / (1000 * 3600 * 24));
  };

  // Utility to calculate the remaining days until the end date
  const calculateRemainingDays = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const remainingTime = end - today;

    // Ensure the remaining days are not negative
    return remainingTime > 0 ? Math.ceil(remainingTime / (1000 * 3600 * 24)) : 0;
  };


  // Utility to count unique donors based on their IDs
  const getUniqueDonorsCount = (donations) => {
    const donationsArray = donations?.$values || [];
    const donorIds = donationsArray.map((donation) => donation.customerId);
    return new Set(donorIds).size;
  };

  // Navigate to the donation history page
  const handleViewDonations = () => {
    navigate(`/ngo/${program.ngoId}/program/${program.programId}/donations`);
  };

  // Render loading state if data is not yet available
  if (!program) return <div className="ProgramDetail-loading">Loading...</div>;

  // Extract program details for display
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

  return (
    <div className="ProgramDetail-container">
      {/* Program Header */}
      <div className="ProgramDetail-target-progress">
        <h1 className="ProgramDetail-donate-title">
          <FaBullseye /> {program.name || "No name available"}
        </h1>
        <p className="ProgramDetail-donate-description">
          <GoOrganization /> {organizationName}
        </p>
        <p className="ProgramDetail-donate-description">
          <FaHandHoldingHeart />{" "}
          {program.description || "No description available"}
        </p>

        {/* Donation Statistics */}
        <p className="ProgramDetail-target-amount">
          <AiOutlineDollarCircle /> Target:{" "}
          {program.targetAmount?.toFixed(2) || "0.00"}
        </p>
        <p className="ProgramDetail-total-donated">
          <FaHandHoldingHeart /> Total Donated:{" "}
          {program.totalDonatedAmount?.toFixed(2) || "0.00"}
        </p>

        {/* Progress Bar */}
        <div className="ProgramDetail-progress-container">
          <div
            className="ProgramDetail-progress-bar"
            style={{ width: `${percentageAchieved}%` }}
          ></div>
        </div>
        <p className="ProgramDetail-progress-percentage">
          Percentage Achieved: {percentageAchieved.toFixed(2)}%
        </p>
        {program.excessAmount > 0 && (
          <p className="ProgramDetail-excess-amount">
            Excess Amount: ${program.excessAmount.toFixed(2)}
          </p>
        )}

        {/* Donation Details */}
        <div className="ProgramDetail-donation-stats">
          <div
            className="ProgramDetail-stat-box"
            onClick={handleViewDonations}
            style={{ cursor: "pointer" }}
          >
            <FaUsers className="ProgramDetail-icon" />
            <span className="ProgramDetail-stat-label">Total Donors:</span>
            <span className="ProgramDetail-stat-value">
              {getUniqueDonorsCount(program.donations)}
            </span>
          </div>
          <div className="ProgramDetail-stat-box">
            <FaClock className="ProgramDetail-icon" />
            <span className="ProgramDetail-stat-label">
              Total Days of Donation:
            </span>
            <span className="ProgramDetail-stat-value">
              {totalDonationDays}
            </span>
          </div>
          <div className="ProgramDetail-stat-box">
            <FaCalendarAlt className="ProgramDetail-icon" />
            <span className="ProgramDetail-stat-label">Current Date:</span>
            <span className="ProgramDetail-stat-value">
              {new Date().toLocaleDateString()}
            </span>
          </div>
          <div className="ProgramDetail-stat-box">
            <FaCalendarAlt className="ProgramDetail-icon" />
            <span className="ProgramDetail-stat-label">Donation End Date:</span>
            <span className="ProgramDetail-stat-value">
              {new Date(program.endDate).toLocaleDateString()}
            </span>
          </div>
          <div className="ProgramDetail-stat-box">
            <FaClock className="ProgramDetail-icon" />
            <span className="ProgramDetail-stat-label">Remaining Days:</span>
            <span className="ProgramDetail-stat-value">
              {remainingDonationDays}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetail;
