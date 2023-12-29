import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Header from "../../components/Header/Header";
import { registerUser } from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";
import "./signupPage.css";
import SignUpImg from "../../assets/SignUpImg.png";
import FbCard from "../../assets/FacebookCard.png";
import GithCard from "../../assets/GithubCard.png";
import GgCard from "../../assets/GoogleCard.png";

const SignupPage = () => {
  const { setAuthState } = useContext(AuthContext);
  const [newUser, setNewUser] = useState({
    email: "",
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  // Function to fetch Google Auth URL
  const fetchGoogleAuthUrl = async () => {
    try {
      const response = await axios.post("http://localhost:3000/request");
      const googleAuthUrl = response.data.url;
      window.location.href = googleAuthUrl; // Redirect to Google Auth URL
    } catch (error) {
      console.error("Error fetching Google Auth URL:", error);
    }
  };

  // Handle changes in form inputs
  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewUser({ ...newUser, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = await registerUser(newUser);
      setAuthState({
        isAuthenticated: true,
        user: data.user,
        token: data.token,
      });
      navigate("/"); // Navigate to home or dashboard after successful registration
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  // Handle click on Google logo
  const handleGoogleSignIn = () => {
    fetchGoogleAuthUrl();
  };

  return (
    <div className="signup-page">
      <Header />
      <div className="signup-body">
        <div className="signup-image-section">
          <img src={SignUpImg} alt="Byte Battles Signup" />
        </div>
        <div className="signup-form-section">
          <div className="signup-container">
            <h2 className="signup-title">Byte Battle</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Mail Id"
                value={newUser.email}
                onChange={handleChange}
              />
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Username"
                value={newUser.username}
                onChange={handleChange}
              />
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={newUser.password}
                onChange={handleChange}
              />
              <button type="submit" className="signup-button">
                Register
              </button>
            </form>
            <div className="signup-options">
              <a href="#" className="login-link">
                Have an Account? Log In
              </a>
            </div>
            <div className="social-signup">
              <p>Or you can Signup with</p>
              <div className="social-icons">
                <img
                  src={GgCard}
                  alt="Google"
                  className="social-icon google"
                  onClick={handleGoogleSignIn}
                />
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
