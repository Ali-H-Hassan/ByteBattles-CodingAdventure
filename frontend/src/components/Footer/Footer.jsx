import React from "react";
import "./Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faTwitter,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-section">
        <div className="footer-logo-contact">
          <p className="footer-address">
            <strong>Address:</strong>
            <br />
            Haddath, Beirut
          </p>
          <p className="footer-contact">
            <strong>Contact:</strong>
            <br />
            +961 78 988 705
            <br />
            info@ByteBattles.io
          </p>
          <div className="social-icons">
            <ul>
              <li className="item facebook">
                <a href="https://www.facebook.com">
                  <FontAwesomeIcon icon={faFacebookF} className="icon" />
                </a>
              </li>
              <li className="item instagram">
                <a href="https://www.instagram.com">
                  <FontAwesomeIcon icon={faInstagram} className="icon" />
                </a>
              </li>
              <li className="item twitter">
                <a href="https://www.twitter.com">
                  <FontAwesomeIcon icon={faTwitter} className="icon" />
                </a>
              </li>
              <li className="item linkedin">
                <a href="https://www.linkedin.com">
                  <FontAwesomeIcon icon={faLinkedinIn} className="icon" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-links">
          <a href="#">About Us</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Careers</a>
          <a href="#">Contact Us</a>
          <a href="#">Terms and conditions</a>
        </div>
        <div className="footer-links">
          <a href="#">Courses</a>
          <a href="#">Tests</a>
          <a href="#">Company wise</a>
          <a href="#">How to begin?</a>
          <a href="#">Test wise</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>Copyright © 2024 BYTEBATTLES. All right reserved.</p>
        <div className="footer-legal-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
