import React, { useEffect, useState } from "react";
import { getAllCustomers } from "../ServiceAdmin/CustomerService";
import { getProgramDonations } from "../ServiceAdmin/DonationService";
import { getAllNGOs } from "../../NGO/Service/ngoService"; // Import API để lấy danh sách tổ chức
import { getPrograms } from "../../NGO/Service/programService";
import "./Dashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrganizations: 0,
    totalUsers: 0,
    totalDonations: 0,
    totalPrograms: 0, // Thêm dòng này
    recentTransactions: [],
    donationLeaderboard: [],
    newOrganizations: 0, // New organizations in the last month
    newUsers: 0, // New users in the last month
  });

  const [error, setError] = useState(null);

  const fetchOrganizations = async () => {
    try {
      const data = await getAllNGOs();
      const ngoList = data?.$values || [];
      setStats((prevStats) => ({
        ...prevStats,
        totalOrganizations: ngoList.length,
        newOrganizations: ngoList.filter(
          (ngo) =>
            new Date(ngo.creationDate) >
            new Date().setMonth(new Date().getMonth() - 1)
        ).length, // Filter new organizations in the last month
      }));
    } catch (error) {
      console.error("Error fetching organizations:", error.message);
      setError(error.message);
    }
  };

  const fetchCustomers = async () => {
    try {
      const data = await getAllCustomers();
      const customerList = data?.$values || [];
      setStats((prevStats) => ({
        ...prevStats,
        totalUsers: customerList.length,
        newUsers: customerList.filter(
          (user) =>
            new Date(user.registrationDate) >
            new Date().setMonth(new Date().getMonth() - 1)
        ).length, // Filter new users in the last month
      }));
    } catch (error) {
      console.error("Error fetching customers:", error.message);
      setError(error.message);
    }
  };

  const fetchPrograms = async () => {
    try {
      // Giả sử bạn có API để lấy danh sách các chương trình
      const data = await getPrograms(); // Thay `getAllPrograms` bằng API thực tế của bạn
      const programList = data?.$values || [];
      setStats((prevStats) => ({
        ...prevStats,
        totalPrograms: programList.length,
      }));
    } catch (error) {
      console.error("Error fetching programs:", error.message);
      setError(error.message);
    }
  };

  const fetchDonations = async () => {
    try {
      const data = await getProgramDonations();
      const donations = data?.$values || [];

      const totalDonations = donations.reduce(
        (sum, donation) => sum + (donation.amount || 0),
        0
      );
      const sortedDonations = donations.sort(
        (a, b) => new Date(b.donationDate) - new Date(a.donationDate)
      );
      const recentTransactions = sortedDonations
        .slice(0, 5)
        .map((donation) => ({
          id: donation.donationId,
          user: donation.donorName,
          amount: donation.amount,
          date: donation.donationDate,
        }));
      const donationLeaderboard = donations
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5)
        .map((donation) => ({
          user: donation.donorName,
          amount: donation.amount,
        }));

      setStats((prevStats) => ({
        ...prevStats,
        totalDonations,
        recentTransactions,
        donationLeaderboard,
      }));
    } catch (error) {
      console.error("Error fetching donations:", error.message);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchOrganizations();
    fetchCustomers();
    fetchDonations();
    fetchPrograms();
  }, []);

  return (
    <div className="admin-dashboard">
      <h1>Dashboard</h1>

      {error && <div className="error">Error: {error}</div>}

      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Organizations</h3>
          <p>{stats.totalOrganizations}</p>
        </div>
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Total Donations</h3>
          <p>${stats.totalDonations.toLocaleString()}</p>
        </div>
      </div>

      <div className="performance-summary">
        {/* <h2>Performance Summary</h2> */}
        <div className="stat-card">
          <h3>Total Programs</h3>
          <p>{stats.totalPrograms}</p>
        </div>
        <div className="stat-card">
          <h3>New Users This Month</h3>
          <p>{stats.newUsers}</p>
        </div>
      </div>

      <div className="recent-donation-container">
        <div className="recent-transactions">
          <h2>Recent Transactions</h2>
          {stats.recentTransactions.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.id}</td>
                    <td>{transaction.user}</td>
                    <td className="Dashboard-td">
                      ${transaction.amount.toLocaleString()}
                    </td>
                    <td>{new Date(transaction.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No recent transactions</p>
          )}
        </div>

        {/* <div className="donation-leaderboard">
                    <h2>Donation Leaderboard</h2>
                    {stats.donationLeaderboard.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.donationLeaderboard.map((leader, index) => (
                                    <tr key={index}>
                                        <td>{leader.user}</td>
                                        <td>${leader.amount.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No donations to display</p>
                    )}
                </div> */}
      </div>
    </div>
  );
};

export default AdminDashboard;
