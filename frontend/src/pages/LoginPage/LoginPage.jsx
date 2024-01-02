import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header/Header";
import { loginUser } from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";
import "./loginPage.css";
import LoginImg from "../../assets/LoginImg.png";
import FbCard from "../../assets/FacebookCard.png";
import GithCard from "../../assets/GithubCard.png";
import GgCard from "../../assets/GoogleCard.png";

const LoginPage = () => {
  const { setAuthState } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = await loginUser(credentials);
      setAuthState({
        isAuthenticated: true,
        user: data.user,
        token: data.token,
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleSignUpClick = () => {
    navigate("/signup");
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
            <div className="input-group">
              <input
                className="input"
                required
                type="email"
                id="email"
                name="email"
                placeholder=" "
                value={credentials.email}
                onChange={handleChange}
              />
              <label className="label" htmlFor="email">
                Email
              </label>
            </div>
            <div className="input-group">
              <input
                className="input"
                required
                type="password"
                id="password"
                name="password"
                placeholder=" "
                value={credentials.password}
                onChange={handleChange}
              />
              <label className="label" htmlFor="password">
                Password
              </label>
            </div>
            <button type="submit" className="login-button">
              Log In
            </button>
            <div className="login-options">
              <a href="#" className="forgot-password">
                Forget Password?
              </a>
              <a href="#" className="signup-link" onClick={handleSignUpClick}>
                Sign Up
              </a>
            </div>
            <div className="social-signup">
              {/* Social login and other components, add functionality as needed */}
              <p>Or you can Signup with</p>
              <div className="social-icons">
                <img src={GgCard} alt="Google" className="social-icon google" />
                <img
                  src={GithCard}
                  alt="GitHub"
                  className="social-icon github"
                />
                <img
                  src={FbCard}
                  alt="Facebook"
                  className="social-icon facebook"
                />
              </div>
              <p className="recaptcha-text">
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
