import React from "react";
import "./Footer.css";
import logo from "../../assets/Logo.png";
import Facebook from "../../assets/Facebook.png";
import Instagram from "../../assets/Instagram.png";
import Twitter from "../../assets/Twitter.png";
import LinkedIn from "../../assets/LinkedIn.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-section">
        <div className="footer-logo-contact">
          <div className="footer-logo1">
            <img src={logo} alt="Byte Battles logo" className="footer-logo1" />
            <h2 className="footer-brand-name">Byte Battles</h2>
          </div>

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
            {/* Placeholders for social icons */}
            <div className="icon facebook">
              <img
                src={Facebook}
                alt="Byte Battles logo"
                className="footer-logo"
              />
            </div>
            <div className="icon twitter">
              <img
                src={Instagram}
                alt="Byte Battles logo"
                className="footer-logo"
              />
            </div>
            <div className="icon instagram">
              <img
                src={Twitter}
                alt="Byte Battles logo"
                className="footer-logo"
              />
            </div>
            <div className="icon linkedin">
              <img
                src={LinkedIn}
                alt="Byte Battles logo"
                className="footer-logo"
              />
            </div>
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
