import React, { useState } from "react";
import Header from "../../components/Header/Header";
import { loginUser } from "../../services/authService"; // Ensure this is the correct import path
import "./loginPage.css";
import LoginImg from "../../assets/LoginImg.png"; // Ensure assets are correctly imported
import FbCard from "../../assets/FacebookCard.png";
import GithCard from "../../assets/GithubCard.png";
import GgCard from "../../assets/GoogleCard.png";

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = await loginUser(credentials);
      // Handle successful login
      console.log("Login Success:", data);
      // Redirect or perform other actions
    } catch (error) {
      // Handle login error
      console.error("Login Error:", error);
    }
  };

  return (
    <div className="login-page">
      <Header />
      <div className="login-body">
        <div className="login-image-section">
          <img src={LoginImg} alt="Byte Battles Login" />
        </div>
        <div className="login-form-section">
          <form onSubmit={handleSubmit} className="login-container">
            <h2 className="login-title">Byte Battle</h2>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Example@example.com"
              value={credentials.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={handleChange}
              required
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
              <p>Or you can Login with</p>
              <div className="social-icons">
                <img src={GgCard} className="social-icon google" alt="Google" />
                <img
                  src={GithCard}
                  className="social-icon github"
                  alt="GitHub"
                />
                <img
                  src={FbCard}
                  className="social-icon facebook"
                  alt="Facebook"
                />
              </div>
              <p>
                This site is protected by reCAPTCHA and the Google Privacy
                Policy and Terms of Service apply.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
