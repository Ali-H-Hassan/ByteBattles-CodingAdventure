import React from "react";
import "./Footer.css";
import logo from "../../assets/LogoTransparent.png"; // Update with the path to your logo image

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-top">
          <div className="brand-container">
            <img src={logo} alt="Byte Battles logo" className="logo" />
            <div className="brand-name">Byte Battles</div>
          </div>
          <div className="address-contact">
            <div className="address">
              <div className="title">Address:</div>
              <div>Hadath, Beirut</div>
            </div>
            <div className="contact">
              <div className="title">Contact:</div>
              <div>
                +961 78 988 705
                <br />
                info@ByteBattles.io
              </div>
            </div>
          </div>
          <div className="social-icons">
            {/* Placeholders for social icons */}
            <div className="icon facebook"></div>
            <div className="icon twitter"></div>
            <div className="icon instagram"></div>
            <div className="icon linkedin"></div>
          </div>
        </div>
        <div className="footer-links">
          <div className="links-column">
            <a href="#">About Us</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Careers</a>
            <a href="#">Contact Us</a>
            <a href="#">Terms and conditions</a>
          </div>
          <div className="links-column">
            <a href="#">Courses</a>
            <a href="#">Tests</a>
            <a href="#">Company wise</a>
            <a href="#">How to begin?</a>
            <a href="#">Test wise</a>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="line"></div>
          <div className="bottom-content">
            <div className="copyright">
              Copyright © 2024 BYTEBATTLES. All right reserved.
            </div>
            <div className="policy-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
