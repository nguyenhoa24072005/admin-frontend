import React, { useEffect, useState } from "react";
import { getProgramDonations } from "../../NGO/Service/programDonationService";
import "./Prodonation.css";

const ProgramDonationList = () => {
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDonor, setSearchDonor] = useState("");
  const [searchNGO, setSearchNGO] = useState("");
  const [searchProgram, setSearchProgram] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const data = await getProgramDonations();
        const donationList = data.$values || [];
        setDonations(donationList);
        setFilteredDonations(donationList); // Initialize filtered list
      } catch (err) {
        console.error("Error fetching donations:", err);
        setError("Failed to fetch program donations.");
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  // Handle filtering functionality
  useEffect(() => {
    const filtered = donations.filter((donation) =>
      (searchTerm
        ? Object.values(donation)
            .join(" ")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        : true) &&
      (searchDonor
        ? donation.donorName?.toLowerCase().includes(searchDonor.toLowerCase())
        : true) &&
      (searchNGO
        ? donation.ngoName?.toLowerCase().includes(searchNGO.toLowerCase())
        : true) &&
      (searchProgram
        ? donation.programName
            ?.toLowerCase()
            .includes(searchProgram.toLowerCase())
        : true)
    );
    setFilteredDonations(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  }, [searchTerm, searchDonor, searchNGO, searchProgram, donations]);

  // Calculate the displayed donations for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDonations = filteredDonations.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);

  if (loading) return <p className="ProgramDonationList-loading">Loading...</p>;
  if (error) return <p className="ProgramDonationList-error">{error}</p>;

  return (
    <div className="ProgramDonationList-container">
      <h2 className="ProgramDonationList-title">Program Donation History</h2>

      {/* Search Filters */}
      <div className="ProgramDonationList-search-container">
        <input
          type="text"
          placeholder="Search anything..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="ProgramDonationList-search-input"
        />
        <input
          type="text"
          placeholder="Search by Donor Name..."
          value={searchDonor}
          onChange={(e) => setSearchDonor(e.target.value)}
          className="ProgramDonationList-search-input"
        />
        <input
          type="text"
          placeholder="Search by NGO Name..."
          value={searchNGO}
          onChange={(e) => setSearchNGO(e.target.value)}
          className="ProgramDonationList-search-input"
        />
        <input
          type="text"
          placeholder="Search by Program Name..."
          value={searchProgram}
          onChange={(e) => setSearchProgram(e.target.value)}
          className="ProgramDonationList-search-input"
        />
      </div>

      {/* Donation Table */}
      <div className="ProgramDonationList-table-container">
        <table className="ProgramDonationList-table">
          <thead>
            <tr className="ProgramDonationList-table-tr">
              <th>Donation ID</th>
              <th>Donor Name</th>
              <th>Donor Email</th>
              <th>NGO Name</th>
              <th>Program Name</th>
              <th>Amount</th>
              <th>Payment Status</th>
              <th>Donation Date</th>
            </tr>
          </thead>
          <tbody>
            {currentDonations.map((donation) => (
              <tr
                className="ProgramDonationList-table-tr2"
                key={donation.donationId}
              >
                <td>{donation.donationId}</td>
                <td>{donation.donorName}</td>
                <td>{donation.donorEmail}</td>
                <td>{donation.ngoName}</td>
                <td>{donation.programName}</td>
                <td className="ProgramDonationList-td">{donation.amount}</td>
                <td>{donation.paymentStatus}</td>
                <td>{new Date(donation.donationDate).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="ProgramDonationList-pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            disabled={currentPage === index + 1}
            className={`ProgramDonationList-pagination-button ${
              currentPage === index + 1 ? "disabled" : ""
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProgramDonationList;
