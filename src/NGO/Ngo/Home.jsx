import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  FaUsers,
  FaBuilding,
  FaCalendarAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { getEmployees } from "../Service/employeeService";
import { getDepartments } from "../Service/departmentService";
import { getWorkSchedules } from "../Service/workScheduleService";
import { getAttendances } from "../Service/AttendanceService";
import { getLeaves } from "../Service/leaveService";
import { Pie, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import "./DashBoard.css";

ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

function DashBoard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    totalSchedules: 0,
    totalPresentToday: 0,
    recentLeaves: [],
    attendanceDistribution: { Present: 0, Absent: 0, Late: 0, OnLeave: 0 },
    employeesPerDepartment: {},
    leavesPerMonth: [],
  });
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      // Fetch Employees
      const employees = await getEmployees("Active");
      const totalEmployees = employees.length;

      // Fetch Departments
      const departments = await getDepartments();
      const totalDepartments = departments.length;

      // Fetch Work Schedules
      const schedules = await getWorkSchedules();
      const totalSchedules = (schedules.data?.result || schedules).length;

      // Fetch Attendances
      const today = new Date().toISOString().slice(0, 10);
      const attendances = await getAttendances();
      const attendanceDistribution = {
        Present: 0,
        Absent: 0,
        Late: 0,
        OnLeave: 0,
      };
      attendances.forEach((att) => {
        const status = att.status?.toLowerCase();
        if (att.attendanceDate?.slice(0, 10) === today) {
          if (status === "present") attendanceDistribution.Present++;
          else if (status === "absent") attendanceDistribution.Absent++;
          else if (status === "late") attendanceDistribution.Late++;
          else if (status === "onleave") attendanceDistribution.OnLeave++;
        }
      });
      const totalPresentToday = attendanceDistribution.Present;

      // Log attendance data for debugging
      console.log("Attendance Distribution:", attendanceDistribution);
      console.log("Total Present Today:", totalPresentToday);

      // Employees per Department
      const employeesPerDepartment = departments.reduce((acc, dept) => {
        acc[dept.departmentName] = employees.filter(
          (emp) => emp.departmentId === dept.departmentId
        ).length;
        return acc;
      }, {});

      // Fetch Leaves
      const leaves = await getLeaves();
      const recentLeaves = leaves
        .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
        .slice(0, 5)
        .map((leave) => ({
          id: leave.leaveId,
          employee: leave.employee?.fullName || "N/A",
          type: leave.leaveType,
          startDate: leave.startDate?.slice(0, 10),
        }));

      // Leaves per Month (last 6 months)
      const months = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return date.toLocaleString("default", {
          month: "short",
          year: "numeric",
        });
      }).reverse();
      const leavesPerMonth = months.map((month) => {
        const [monthName, year] = month.split(" ");
        const monthIndex = new Date(
          Date.parse(`${monthName} 1, ${year}`)
        ).getMonth();
        return leaves.filter((leave) => {
          const leaveDate = new Date(leave.startDate);
          return (
            leaveDate.getMonth() === monthIndex &&
            leaveDate.getFullYear() === parseInt(year)
          );
        }).length;
      });

      setStats({
        totalEmployees,
        totalDepartments,
        totalSchedules,
        totalPresentToday,
        recentLeaves,
        attendanceDistribution,
        employeesPerDepartment,
        leavesPerMonth,
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err.message);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Pie Chart: Attendance Distribution
  const pieData = {
    labels: ["Present", "Absent", "Late", "OnLeave"],
    datasets: [
      {
        data: [
          stats.attendanceDistribution.Present || 0,
          stats.attendanceDistribution.Absent || 0,
          stats.attendanceDistribution.Late || 0,
          stats.attendanceDistribution.OnLeave || 0,
        ],
        backgroundColor: ["#f5a623", "#6c757d", "#dc3545", "#007bff"],
        hoverOffset: 4,
      },
    ],
  };

  // Check if pie chart has valid data
  const hasPieData = pieData.datasets[0].data.some((value) => value > 0);
  console.log("Pie Chart Data Valid:", hasPieData, pieData.datasets[0].data);

  // Bar Chart: Employees per Department
  const barData = {
    labels: Object.keys(stats.employeesPerDepartment),
    datasets: [
      {
        label: "Employees",
        data: Object.values(stats.employeesPerDepartment),
        backgroundColor: "#f5a623",
        borderColor: "#d68f1e",
        borderWidth: 1,
      },
    ],
  };

  // Line Chart: Leaves per Month
  const lineData = {
    labels: Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return date.toLocaleString("default", { month: "short" });
    }).reverse(),
    datasets: [
      {
        label: "Leave Requests",
        data: stats.leavesPerMonth,
        fill: false,
        borderColor: "#f5a623",
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow custom height
    plugins: {
      legend: { position: "top" },
      tooltip: { enabled: true },
    },
  };

  return (
    <main className="DashBoardContainer">
      <div className="DashBoardTitle">
        <h3>DASHBOARD</h3>
      </div>

      {error && <div className="DashBoardError">Error: {error}</div>}

      {/* Statistic Cards */}
      <div className="DashBoardCards">
        <div className="DashBoardCard">
          <div className="DashBoardCardInner">
            <h3>EMPLOYEES</h3>
            <FaUsers className="DashBoardCardIcon" />
          </div>
          <NavLink to="/employees" className="DashBoardCardNumber">
            <h1>{stats.totalEmployees}</h1>
          </NavLink>
        </div>

        <div className="DashBoardCard">
          <div className="DashBoardCardInner">
            <h3>DEPARTMENTS</h3>
            <FaBuilding className="DashBoardCardIcon" />
          </div>
          <NavLink to="/departments" className="DashBoardCardNumber">
            <h1>{stats.totalDepartments}</h1>
          </NavLink>
        </div>

        <div className="DashBoardCard">
          <div className="DashBoardCardInner">
            <h3>SCHEDULES</h3>
            <FaCalendarAlt className="DashBoardCardIcon" />
          </div>
          <NavLink to="/schedules" className="DashBoardCardNumber">
            <h1>{stats.totalSchedules}</h1>
          </NavLink>
        </div>

        <div className="DashBoardCard">
          <div className="DashBoardCardInner">
            <h3>PRESENT TODAY</h3>
            <FaCheckCircle className="DashBoardCardIcon" />
          </div>
          <NavLink to="/attendances" className="DashBoardCardNumber">
            <h1>{stats.totalPresentToday}</h1>
          </NavLink>
        </div>
      </div>

      {/* Charts Section */}
      <div className="DashBoardCharts">
        <div className="DashBoardChart">
          <h4>Attendance Distribution (Today)</h4>
          {hasPieData ? (
            <div className="ChartWrapper">
              <Pie data={pieData} options={chartOptions} height={300} />
            </div>
          ) : (
            <p className="DashBoardChartNoData">
              No attendance data for today.
            </p>
          )}
        </div>

        <div className="DashBoardChart">
          <h4>Employees per Department</h4>
          <div className="ChartWrapper">
            <Bar data={barData} options={chartOptions} height={300} />
          </div>
        </div>

        <div className="DashBoardChart">
          <h4>Leave Requests (Last 6 Months)</h4>
          <div className="ChartWrapper">
            <Line data={lineData} options={chartOptions} height={300} />
          </div>
        </div>
      </div>

      {/* Recent Leaves Table */}
      <div className="DashBoardRecentLeaves">
        <h4>Recent Leave Requests</h4>
        <table className="DashBoardTable">
          <thead>
            <tr>
              <th>ID</th>
              <th>Employee</th>
              <th>Leave Type</th>
              <th>Start Date</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentLeaves.length > 0 ? (
              stats.recentLeaves.map((leave) => (
                <tr key={leave.id}>
                  <td>{leave.id}</td>
                  <td>{leave.employee}</td>
                  <td>{leave.type}</td>
                  <td>{leave.startDate}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No recent leaves.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default DashBoard;
