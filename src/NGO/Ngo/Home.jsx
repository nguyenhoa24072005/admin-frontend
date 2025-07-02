import React, { useState, useEffect } from 'react';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs';
import './DashBoard.css';
import { NavLink } from 'react-router-dom';
import { getPrograms } from '../../NGO/Service/programService.js'; // Import function lấy dữ liệu chương trình
import { getProgramDonations } from "../../Admin/ServiceAdmin/DonationService.js";

function DashBoard() {
  const [programs, setPrograms] = useState([]); // State để lưu danh sách chương trình
  const [orders, setOrders] = useState([]); // State để lưu danh sách đơn hàng
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
      totalOrganizations: 0,
      totalUsers: 0,
      totalDonations: 0,
      totalPrograms: 0, // Thêm dòng này
      runningPrograms: 0, // Thêm số lượng chương trình đang chạy
      completedPrograms: 0, // Thêm số lượng chương trình đã kết thúc
      recentTransactions: [],
      donationLeaderboard: [],
      newOrganizations: 0, // New organizations in the last month
      newUsers: 0, // New users in the last month
    });

    const fetchPrograms = async () => {
      try {
        const data = await getPrograms();
        console.log("Programs data:", data); // Kiểm tra dữ liệu trả về
        const programList = data?.$values || [];
        
        // Kiểm tra xem dữ liệu có chương trình với trạng thái 'RUNNING' và 'COMPLETED'
        console.log("Running Programs:", programList.filter((program) => program.status === 'Ongoing'));
        console.log("Completed Programs:", programList.filter((program) => program.status === 'Completed'));
    
        const runningPrograms = programList.filter((program) => program.status === 'Ongoing').length;
        const completedPrograms = programList.filter((program) => program.status === 'Completed').length;
    
        setStats((prevStats) => ({
          ...prevStats,
          totalPrograms: programList.length,
          runningPrograms, // Số lượng chương trình đang chạy
          completedPrograms, // Số lượng chương trình đã kết thúc
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
        fetchPrograms();
        fetchDonations();
        console.log('Stats:', stats)
      }, []);
  
  return (
    <main className="main-container">
      <div className="main-title">
        <h3>DASHBOARD</h3>
      </div>

      {/* Cards in one row */}
      <div className="main-cards row">
        <div className="card">
          <div className="card-inner">
            <h3>PROGRAMS</h3>
            <BsFillArchiveFill className="card_icon" />
          </div>
          <NavLink to="/admin/programs" className="number-program">
            <h1 className="number-program">{stats.totalPrograms}</h1>
          </NavLink>
        </div>

        <div className="card">
          <div className="card-inner">
            <h3>Donations</h3>
            <BsFillGrid3X3GapFill className="card_icon" />
          </div>
          <NavLink to="/admin/orders/PENDING" className="number-product">
            <h1 className="number-product">
            {stats.totalDonations.toLocaleString()}$
            </h1>
          </NavLink>
        </div>

        <div className="card">
  <div className="card-inner">
    <h3>RUNNING PROGRAMS</h3>
    <BsPeopleFill className="card_icon" />
  </div>
  <NavLink to="/admin/programs/running" className="number-product">
    <h1 className="number-product">
      {stats.runningPrograms} {/* Hiển thị số lượng chương trình đang chạy */}
    </h1>
  </NavLink>
</div>

<div className="card">
  <div className="card-inner">
    <h3>COMPLETED PROGRAMS</h3>
    <BsFillBellFill className="card_icon" />
  </div>
  <NavLink to="/admin/programs/completed" className="number-product">
    <h1 className="number-product">
      {stats.completedPrograms} {/* Hiển thị số lượng chương trình đã kết thúc */}
    </h1>
  </NavLink>
</div>

      </div>
    </main>
  );
}

export default DashBoard;
