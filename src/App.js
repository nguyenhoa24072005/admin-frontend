import React, { useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Client/Home/Home";
import About from "./Client/About/About";
import Contact from "./Client/Contact/Contact";
import Ngos from "./Client/Ngos/Ngos";
import LoginForm from "./Client/Login/LoginForm";
import RegisterForm from "./Client/Register/RegisterForm";
import ForgotAndResetPassword from "./Client/ForgotPassword/ForgotPassword";
import Authentication from "./Admin/Authentication/Authentication";
import AuthContext, { AuthProvider } from "./Context/AuthContext";
import CustomerData from "./Client/Profile/Profile";
import Favorites from "./Client/Favorites/Favorites";
import ProgramList from "./Client/ProgramList/ProgramList";
import Donate from "./Client/Donate/Donate";
import ThankYouBill from "./Client/Bill/ThankYouBill";
import NgoDetail from "./Client/Ngos/Ngodetail/Ngodetail";
import ProgramListDetail from "./Client/ProgramList/ProgramListDetail/ProgramListDetail";
import NotFound from "./404/NotFound";
import { FavoritesProvider } from "./Context/FavoritesContext"; // Import FavoritesProvider
import DonateDetail1 from "./Client/Donate/DonateDetail";

// Admin routes
import Dashboard from "./Admin/Dashboard/Dashboard";
import CustomerManagement from "./Admin/Customer/CustomerManagement";
import Inviation from "./Admin/Invitation/Invitation";
import ProgramDonation from "./Admin/ProgramDonation/ProgramDonation";
import CensorNgo from "./Admin/CensorNgo/CensorNgo";
import Ngoadmin from "./Admin/Ngoadmin/Ngoadmin";
import TransactionHistory from "./Admin/TransactionHistory/TransactionHistory";
import ResetPassword from "./Client/ResetPassword/ResetPassword";

import Ngo from "./NGO/Ngo/Ngo";
import DashBoard from "./NGO/Ngo/Home";
import DepartmentList from "./NGO/Department/DepartmentList";
import PositionList from "./NGO/Positions/PositionList";
import EmployeeList from "./NGO/Employees/EmployeeList";
import UserList from "./NGO/Users/UserList";
import RoleList from "./NGO/Roles/RoleList";
import EmployeeHistoryList from "./NGO/EmployeeHistory/EmployeeHistoryList";
import QRInfoList from "./NGO/QRInfo/QRInfoList";
import QRAttendanceList from "./NGO/QRAttendance/QRAttendanceList";
import LeaveList from "./NGO/Leave/LeaveList";
import WorkScheduleInfoList from "./NGO/WorkScheduleInfo/WorkScheduleInfoList";
import WorkScheduleList from "./NGO/WorkSchedule/WorkScheduleList";
import AttendanceList from "./NGO/Attendance/AttendanceList";
import AttendanceAppealList from "./NGO/AttendanceAppeal/AttendanceAppealList";
import UserDetail from "./NGO/UserDetail/UserDetail";
import Notification from "./NGO/Notification/Notification";

import "./App.css"; // Ensure no duplicate imports

// Wrapper function to ensure AuthProvider and FavoritesProvider are available
function App() {
  const { auth } = useContext(AuthContext); // Access auth state

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Client Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/ngos" element={<Ngos />} />
          <Route path="/program" element={<ProgramList />} />
          <Route path="/ngos/:id" element={<NgoDetail />} />
          <Route path="/donate/:programId" element={<Donate />} />
          <Route
            path="/ngo/:ngoId/program/:programId/donations"
            element={<DonateDetail1 />}
          />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/forgot-password" element={<ForgotAndResetPassword />} />
          <Route path="/profile" element={<CustomerData />} />
          <Route
            path="/program/:programId"
            element={<ProgramListDetail />}
          />{" "}
          <Route path="/404" element={<NotFound />} />
          <Route path="/thank-you-bill" element={<ThankYouBill />} />
          {/* Admin Routes */}
          <Route path="/admin" element={<Authentication />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="customers" element={<CustomerManagement />} />
            <Route path="ngoadmin" element={<Ngoadmin />} />
            <Route path="inviation" element={<Inviation />} />
            <Route path="censorngo" element={<CensorNgo />} />
            <Route path="programdonation" element={<ProgramDonation />} />
            <Route path="transactionhistory" element={<TransactionHistory />} />
          </Route>
          <Route path="/ngo" element={<Ngo />}>
            <Route index element={<DashBoard />} />
            <Route path="dashboard" element={<DashBoard />} />
            <Route path="departments" element={<DepartmentList />} />
            <Route path="ngo-detail" element={<NgoDetail />} />
            <Route path="Positions" element={<PositionList />} />
            <Route path="Employees" element={<EmployeeList />} />
            <Route path="Users" element={<UserList />} />
            <Route path="Roles" element={<RoleList />} />
            <Route path="EmployeeHistory" element={<EmployeeHistoryList />} />
            <Route path="QRInfo" element={<QRInfoList />} />
            <Route path="QRAttendance" element={<QRAttendanceList />} />
            <Route path="Leave" element={<LeaveList />} />
            <Route path="WorkScheduleInfo" element={<WorkScheduleInfoList />} />
            <Route path="WorkSchedule" element={<WorkScheduleList />} />
            <Route path="Attendance" element={<AttendanceList />} />
            <Route path="AttendanceAppeal" element={<AttendanceAppealList />} />
            <Route path="Notification" element={<Notification/>} />

            {/* Route con cho UserDetail */}
            <Route path="users/:userId" element={<UserDetail />} />
          </Route>
          {/* Reset Password Route */}
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

// Wrap App with AuthProvider and FavoritesProvider
export default function WrappedApp() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <App />
      </FavoritesProvider>
    </AuthProvider>
  );
}
