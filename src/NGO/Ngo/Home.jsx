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
import { getAllActiveAttendances, filterAttendances } from "../Service/qrAttendanceService";
import { getLeaves } from "../Service/leaveService";
import { getAllAppeals } from "../Service/attendanceAppealService";
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
    totalOvertimeShifts: 0,
    totalSchedules: 0,
    totalPresentToday: 0,
    recentLeaves: [],
    attendanceDistribution: { CheckIn: 0, CheckOut: 0 },
    employeesPerDepartment: {},
    leavesPerMonth: [],
    presentEmployeesToday: [],
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [qrAttendances, setQrAttendances] = useState([]);
  const [todayString, setTodayString] = useState("");

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Set today's date
      const today = new Date();
      const todayStr = today.toISOString().slice(0, 10); // "2025-07-21"
      console.log("Today (+07):", todayStr);
      setTodayString(todayStr);

      // Fetch Employees
      const employees = await getEmployees("Active");
      const totalEmployees = employees.length;

      // Fetch Departments
      const departments = await getDepartments();
      const totalDepartments = departments.length;

      // Fetch Work Schedules
      const schedules = await getWorkSchedules();
      const allSchedules = schedules?.data?.result || schedules;
      const totalOvertimeShifts = allSchedules.filter(
        (sch) => sch.isOvertime === true
      ).length;

      // Fetch QR Attendances
      const qrData = await filterAttendances("", todayStr, todayStr);
      console.log("Filtered QR Attendances:", qrData);
      setQrAttendances(qrData);

      const attendanceDistribution = {
        CheckIn: 0,
        CheckOut: 0,
      };

      qrData.forEach((att) => {
        const attDate = new Date(att.attendanceDate).toISOString().slice(0, 10);
        console.log(
          `Attendance ${att.qrId}: Date=${attDate}, Method=${att.attendanceMethod}, Status=${att.status}`
        );
        if (attDate === todayStr) {
          const status = att.status?.toLowerCase();
          if (["checkin", "check_in", "active", "valid"].includes(status)) {
            attendanceDistribution.CheckIn++;
          } else if (["checkout", "check_out", "inactive", "expired"].includes(status)) {
            attendanceDistribution.CheckOut++;
          }
        }
      });

      const totalPresentToday = attendanceDistribution.CheckIn;

      // Employees per Department
      const employeesPerDepartment = departments.reduce((acc, dept) => {
        acc[dept.departmentName] = employees.filter(
          (emp) => emp.departmentId === dept.departmentId
        ).length;
        return acc;
      }, {});

      // Fetch Leaves and Appeals
      const leavesResponse = await getLeaves();
      const appealsResponse = await getAllAppeals();

      const leaveList = leavesResponse?.data?.result || leavesResponse;
      const appealList = appealsResponse?.data?.result || appealsResponse;

      // Filter for Pending status only
      const pendingLeaves = leaveList.filter(
        (leave) => leave.status?.toLowerCase() === "pending"
      );
      const pendingAppeals = appealList.filter(
        (appeal) => appeal.status?.toLowerCase() === "pending"
      );
      const totalRequests = pendingLeaves.length + pendingAppeals.length;

      const recentLeaves = [...pendingLeaves, ...pendingAppeals]
        .sort(
          (a, b) =>
            new Date(b.startDate || b.appealDate) -
            new Date(a.startDate || a.appealDate)
        )
        .slice(0, 5)
        .map((req) => ({
          id: req.leaveId || req.appealId,
          employee: req.employee?.fullName || "N/A",
          type: req.leaveType || "Giải trình",
          startDate: (req.startDate || req.appealDate)?.slice(0, 10),
        }));

      const months = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return date.toLocaleString("default", {
          month: "short",
          year: "numeric",
        });
      }).reverse();

      const presentEmployeesToday = qrData
        .filter(
          (att) =>
            new Date(att.attendanceDate).toISOString().slice(0, 10) === todayStr &&
            ["checkin", "check_in", "active", "valid"].includes(att.status?.toLowerCase())
        )
        .map((att) => att.employee?.fullName || "N/A");

      const leavesPerMonth = months.map((month) => {
        const [monthName, year] = month.split(" ");
        const monthIndex = new Date(
          Date.parse(`${monthName} 1, ${year}`)
        ).getMonth();
        return pendingLeaves.filter((leave) => {
          const leaveDate = new Date(leave.startDate);
          return (
            leaveDate.getMonth() === monthIndex &&
            leaveDate.getFullYear() === parseInt(year)
          );
        }).length;
      });

      console.log("Attendance Distribution:", attendanceDistribution);
      console.log("Pending Requests:", { pendingLeaves, pendingAppeals, totalRequests });
      setStats({
        totalEmployees,
        totalOvertimeShifts,
        totalDepartments,
        totalSchedules: totalRequests,
        totalPresentToday,
        recentLeaves,
        attendanceDistribution,
        employeesPerDepartment,
        leavesPerMonth,
        presentEmployeesToday,
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const pieData = {
    labels: ["CheckIn", "CheckOut"],
    datasets: [
      {
        data: [
          stats.attendanceDistribution.CheckIn || 0,
          stats.attendanceDistribution.CheckOut || 0,
        ],
        backgroundColor: ["#f5a623", "#6c757d"],
        hoverOffset: 4,
      },
    ],
  };

  const hasPieData = pieData.datasets[0].data.some((value) => value > 0);
  console.log("Pie Data:", pieData.datasets[0].data, "Has Data:", hasPieData);

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

  const lineData = {
    labels: Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return date.toLocaleString("default", { month: "short" });
    }).reverse(),
    datasets: [
      {
        label: "Pending Leave Requests",
        data: stats.leavesPerMonth,
        fill: false,
        borderColor: "#f5a623",
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
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

      <div className="DashBoardCards">
        <div className="DashBoardCard">
          <div className="DashBoardCardInner">
            <h3>EMPLOYEES</h3>
            <FaUsers className="DashBoardCardIcon" />
          </div>
          <NavLink
            to="/ngo/Employees"
            className="DashBoardCardNumber"
            onClick={() => console.log("Navigating to /ngo/Employees")}
          >
            <h1>{stats.totalEmployees}</h1>
          </NavLink>
        </div>

        <div className="DashBoardCard">
          <div className="DashBoardCardInner">
            <h3>OVERTIME SHIFTS</h3>
            <FaBuilding className="DashBoardCardIcon" />
          </div>
          <NavLink
            to="/ngo/Schedules"
            className="DashBoardCardNumber"
            onClick={() => console.log("Navigating to /ngo/Schedules")}
          >
            <h1>{stats.totalOvertimeShifts}</h1>
          </NavLink>
        </div>

        <div className="DashBoardCard">
          <div className="DashBoardCardInner">
            <h3>PENDING REQUESTS</h3>
            <FaCalendarAlt className="DashBoardCardIcon" />
          </div>
          <NavLink
            to="/ngo/Leaves"
            className="DashBoardCardNumber"
            onClick={() => console.log("Navigating to /ngo/Leaves")}
          >
            <h1>{stats.totalSchedules}</h1>
          </NavLink>
        </div>

        <div className="DashBoardCard">
          <div className="DashBoardCardInner">
            <h3>PRESENT TODAY</h3>
            <FaCheckCircle className="DashBoardCardIcon" />
          </div>
          <NavLink
            to="/ngo/QRAttendance"
            className="DashBoardCardNumber"
            onClick={() => console.log("Navigating to /ngo/QRAttendance")}
          >
            <h1>{stats.totalPresentToday}</h1>
          </NavLink>
          {/* <ul className="present-list">
            {stats.presentEmployeesToday?.map((name, idx) => (
              <li key={idx}>{name}</li>
            ))}
          </ul> */}
        </div>
      </div>

      <div className="DashBoardCharts">
        <div className="DashBoardChart">
          <h4>Attendance Distribution (Today)</h4>
          {isLoading ? (
            <p>Loading attendance data...</p>
          ) : hasPieData ? (
            <div className="ChartWrapper">
              <Pie data={pieData} options={chartOptions} height={300} />
            </div>
          ) : (
            <p className="DashBoardChartNoData">
              No check-in/check-out data for today.
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
          <h4>Pending Leave Requests (Last 6 Months)</h4>
          <div className="ChartWrapper">
            <Line data={lineData} options={chartOptions} height={300} />
          </div>
        </div>
      </div>

      <div className="DashBoardDebug">
        <h4>Debug: Today's Attendance Records</h4>
        {isLoading ? (
          <p>Loading debug data...</p>
        ) : qrAttendances.length > 0 ? (
          <pre>
            {JSON.stringify(
              qrAttendances.filter(
                (att) =>
                  new Date(att.attendanceDate).toISOString().slice(0, 10) === todayString
              ),
              null,
              2
            )}
          </pre>
        ) : (
          <p>No attendance records found for today.</p>
        )}
      </div>
    </main>
  );
}

export default DashBoard;