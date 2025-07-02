import React, { useState } from "react";
import "./Contact.css";
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import { FaMapLocationDot } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { BsInstagram } from "react-icons/bs";
import { BsTwitterX } from "react-icons/bs";
import { TiSocialGooglePlus } from "react-icons/ti";
import { FaFacebookF } from "react-icons/fa";
import { RiLinkedinLine } from "react-icons/ri";

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Lấy token từ localStorage
    const token = localStorage.getItem("token");

    // Kiểm tra nếu không có token thì hiển thị lỗi
    if (!token) {
      alert("Please login to send the message.");
      return;
    }

    // Gửi dữ liệu tới backend API
    try {
      const response = await fetch(
        "https://charitynavigator-hma3agega6fwfgb2.canadacentral-01.azurewebsites.net/api/query",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Gửi token trong header
          },
          body: JSON.stringify(formData), // Chuyển formData thành JSON
        }
      );

      // Log phản hồi từ backend
      const responseData = await response.json();
      console.log("Response Data: ", responseData); // Để xem chi tiết

      if (response.ok) {
        alert("Message sent successfully!");
        setFormData({
          fullName: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        alert(
          "Failed to send message: " + responseData.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("An error occurred while sending the message.");
    }
  };

  return (
    <div>
      <Header />
      <div className="contact-section">
        <div className="contact-banner">
          <h1 className="contact-h1">Contact Us</h1>
        </div>
        <div className="contact-container">
          <div className="contact-wrapper">
            <div className="contact-text">
              <div className="contact-address">
                <h3 className="contact-address1">ADDRESS</h3>
                <p className="contact-8a">8a Ton That Thuyet, Ha Noi</p>
              </div>
            </div>
            <div className="contact-text">
              <div className="contact-address">
                <h3 className="contact-address1">PHONE</h3>
                <p className="contact-8a">(+84)123456789</p>
              </div>
            </div>
            <div className="contact-text">
              <div className="contact-address">
                <h3 className="contact-address1">EMAIL</h3>
                <p className="contact-8a">Trung@gamil.com</p>
              </div>
            </div>
            <div className="contact-text">
              <h3 className="contact-info">Follow us on</h3>
              <ul className="contact-social">
                <li className="contact-line">
                  <a className="contact-ant" href="">
                    <i className="contact-face">
                      <FaFacebookF />
                    </i>
                  </a>
                </li>
                <li className="contact-line">
                  <a className="contact-ant" href="">
                    <i className="contact-face">
                      <RiLinkedinLine />
                    </i>
                  </a>
                </li>
                <li className="contact-line">
                  <a className="contact-ant" href="">
                    <i className="contact-face">
                      <BsInstagram />
                    </i>
                  </a>
                </li>
                <li className="contact-line">
                  <a className="contact-ant" href="">
                    <i className="contact-face">
                      <TiSocialGooglePlus />
                    </i>
                  </a>
                </li>
                <li className="contact-line">
                  <a className="contact-ant" href="">
                    <i className="contact-face">
                      <BsTwitterX />
                    </i>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Phần bản đồ */}
          <div className="contact-info-section">
            <div className="contact-map-error">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.0966094199107!2d105.7797164115694!3d21.028820080539738!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab4cd376479b%3A0xbc2e0bb9db373ed2!2zOGEgVMO0biBUaOG6pXQgVGh1eeG6v3QsIE3hu7kgxJDDrG5oLCBD4bqndSBHaeG6pXksIEjDoCBO4buZaSAxMDAwMDAsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1735743105610!5m2!1svi!2s">
                allowFullScreen="" loading="lazy" title="Google Map"
              </iframe>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Contact;
