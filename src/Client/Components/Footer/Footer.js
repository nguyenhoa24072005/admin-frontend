import React from "react";
import "./Footer.css";
import { FaPhone } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaPinterestP } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-sections">
          {/* Organization */}
          <div className="footer-section">
            <h3>Organization</h3>
            <ul>
              <li>
                <a href="/ngos">
                  {" "}
                  <i className="fa fa-angle-double-right fa-footer"></i>
                  Join Academy
                </a>
              </li>
              <li>
                <a href="/ngos">
                  {" "}
                  <i className="fa fa-angle-double-right fa-footer"></i>
                  Press Releases
                </a>
              </li>
              <li>
                <a href="/ngos">
                  {" "}
                  <i className="fa fa-angle-double-right fa-footer"></i>
                  Upcoming Events
                </a>
              </li>
              <li>
                <a href="/ngos">
                  {" "}
                  <i className="fa fa-angle-double-right fa-footer"></i>
                  Recent Cause
                </a>
              </li>
            </ul>
            <div className="contact-item">
              <div>
                <p>
                  {" "}
                  <FaLocationDot className="footer-icon" />
                  Road-2, East Shibgonj
                </p>
                <p className="footer-house">House No: M-23</p>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h3>Support</h3>
            <ul>
              <li>
                <a href="/about">
                  {" "}
                  <i className="fa fa-angle-double-right fa-footer"></i>
                  Love Philosophy
                </a>
              </li>
              <li>
                <a href="/about">
                  {" "}
                  <i className="fa fa-angle-double-right fa-footer"></i>
                  Share & Care
                </a>
              </li>
              <li>
                <a href="/about">
                  {" "}
                  <i className="fa fa-angle-double-right fa-footer"></i>
                  Child Education
                </a>
              </li>
              <li>
                <a href="/about">
                  {" "}
                  <i className="fa fa-angle-double-right fa-footer"></i>
                  Medical Treatment
                </a>
              </li>
            </ul>
            <div className="contact-item">
              <div>
                <p>
                  {" "}
                  <MdEmail className="footer-icon" />
                  hoadzai247@gmail.com
                </p>
                <p className="footer-email">nduc37039@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Discover */}
          <div className="footer-section">
            <h3>Discover</h3>
            <ul>
              <li>
                <a href="/program">
                  <i className="fa fa-angle-double-right fa-footer"></i>
                  How to Sponsor
                </a>
              </li>
              <li>
                <a href="/program">
                  <i className="fa fa-angle-double-right fa-footer"></i>
                  Support a Volunteer
                </a>
              </li>
              <li>
                <a href="/program">
                  <i className="fa fa-angle-double-right fa-footer"></i>
                  Community Attitudes
                </a>
              </li>
              <li>
                <a href="/program">
                  {" "}
                  <i className="fa fa-angle-double-right fa-footer"></i>
                  Family Adopting
                </a>
              </li>
            </ul>

            <div className="contact-item">
              <div>
                <p>
                  {" "}
                  <FaPhone className="footer-icon" />
                  (+84) 355 375 444
                </p>
                <p className="footer-sdt">(+84) 332 043 121</p>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="footer-section">
            <h3>About</h3>
            <p className="footer-p">
              We are a volunteer-based organization and help disabled and
              under-privileged children by providing them with funding for
              equipment and services so they can live a better life.
            </p>
            <div className="footer-social1">
              <p className="footer-p1">
                <span className="fa fa-mail-forward"></span>
                Spreads The Words
              </p>

              <div className="footer-social">
                <a href="#">
                  <FaFacebookF className="social-icon" />
                </a>
                <a href="#">
                  <FaTwitter className="social-icon" />
                </a>
                <a href="#">
                  <FaPinterestP className="social-icon" />
                </a>
                <a href="#">
                  <FaLinkedinIn className="social-icon" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>Copyright © 2023. All rights reserved by bluewindlab.net</p>
      </div>
    </footer>
  );
};

export default Footer;
