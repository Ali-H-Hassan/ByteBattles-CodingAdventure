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

  const fetchGoogleAuthUrl = async () => {
    try {
      const response = await axios.post("http://localhost:3000/request");
      const googleAuthUrl = response.data.url;
      window.location.href = googleAuthUrl;
    } catch (error) {
      console.error("Error fetching Google Auth URL:", error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = await registerUser(newUser);
      setAuthState({
        isAuthenticated: true,
        user: data.user,
        token: data.token,
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const handleGoogleSignIn = () => {
    fetchGoogleAuthUrl();
  };

  const handleNavigateToLogin = () => {
    navigate("/login");
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
              <div className="input-group">
                <input
                  className="input"
                  required
                  type="email"
                  id="email"
                  name="email"
                  placeholder=" "
                  value={newUser.email}
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
                  type="text"
                  id="username"
                  name="username"
                  placeholder=" "
                  value={newUser.username}
                  onChange={handleChange}
                />
                <label className="label" htmlFor="username">
                  Username
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
                  value={newUser.password}
                  onChange={handleChange}
                />
                <label className="label" htmlFor="password">
                  Password
                </label>
              </div>
              <button type="submit" className="signup-button">
                Register
              </button>
            </form>
            <div className="signup-options">
              <a
                href="#"
                className="login-link"
                onClick={handleNavigateToLogin}
              >
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
