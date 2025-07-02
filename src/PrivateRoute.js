import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "./Context/AuthContext";

const PrivateRoute = ({ children, role }) => {
  const { auth } = useContext(AuthContext);

  if (!auth?.token) return <Navigate to="/login" />;
  if (role && auth.role !== role) return <Navigate to="/" />;

  return children;
};

export default PrivateRoute;
