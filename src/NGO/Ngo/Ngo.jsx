import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './Ngo.css';
import Header from './Header';
import Sidebar from './Sidebar';

function Ngo() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const toggleSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const isTokenValid = decodedToken.exp * 1000 > Date.now();
        if (isTokenValid) {
          setUserRole(decodedToken.Role || decodedToken.role);
        } else {
          localStorage.removeItem('authToken');
          setUserRole('');
        }
      } catch (err) {
        localStorage.removeItem('authToken');
        setUserRole('');
      }
    } else {
      setUserRole('');
    }
  }, []);

  if (userRole === null) return <div>Loading...</div>;

  const normalizedRole = userRole?.toString().toLowerCase();
  if (normalizedRole !== 'admin') {
    return <Navigate to="/404" />;
  }

  return (
    <div className="grid-container">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} toggleSidebar={toggleSidebar} />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export default Ngo;
