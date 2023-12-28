import React from "react";
import Header from "../../components/Header/Header";
import "./loginPage.css";
import Login from "../../assets/LoginImg.png";
import FbCard from "../../assets/FacebookCard.png";
import GithCard from "../../assets/GithubCard.png";
import GgCard from "../../assets/GoogleCard.png";

const LoginPage = () => {
  return (
    <div className="login-page">
      <Header />
      <div className="login-body">
        <div className="login-image-section">
          <img src={Login} alt="Byte Battles Login" />
        </div>
        <div className="login-form-section">
          <div className="login-container">
            <h2 className="login-title">Byte Battle</h2>
            <input type="email" id="email" name="email" placeholder="Mail Id" />
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
            />
            <button type="submit" className="login-button">
              Log In
            </button>
            <div className="login-options">
              <a href="#" className="forgot-password">
                Forget Password?
              </a>
              <a href="#" className="signup-link">
                Sign Up
              </a>
            </div>
            <div className="social-login">
              <p>Or you can Signup with</p>
              <div className="social-icons">
                <img src={GgCard} className="social-icon google" />
                <img src={GithCard} className="social-icon github" />
                <img src={FbCard} className="social-icon facebook" />
              </div>
              <p>
                This site is protected by reCAPTCHA and the Google Privacy
                Policy and Terms of Service apply.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
