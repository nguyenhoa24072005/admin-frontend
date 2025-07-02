// src/pages/NotFound.js
import React from "react";
import { Link } from "react-router-dom";
import Header from "../Client/Components/Header/Header";
import Footer from "../Client/Components/Footer/Footer";
import "./NotFound.css";
const NotFound = () => {
  return (
    <div className="not-found-container">
      <Header />
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you are looking for doesn't exist.</p>
      <img
        src="/images/404Error-bro.png"
        alt="404 Not Found"
        className="not-found-image"
      />

      <Footer />
    </div>
  );
};

export default NotFound;
