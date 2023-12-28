import React, { useState } from "react";
import Header from "../../components/Header/Header";
import { registerUser } from "../../services/authService"; // Adjust the import path as needed
import "./signupPage.css"; // Adjust the import path as needed
import SignUpImg from "../../assets/SignUpImg.png"; // Adjust the import path as needed
import FbCard from "../../assets/FacebookCard.png"; // Adjust the import path as needed
import GithCard from "../../assets/GithubCard.png"; // Adjust the import path as needed
import GgCard from "../../assets/GoogleCard.png"; // Adjust the import path as needed

const SignupPage = () => {
  const [user, setUser] = useState({
    email: "",
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(user);
      // Assuming the response contains the user and token
      // Save the token in localStorage and update the user state
      localStorage.setItem("token", response.token);
      // Redirect to homepage or dashboard after successful signup
      // This could be done with useHistory from react-router-dom or a state update
    } catch (error) {
      // Handle signup errors, e.g., display error messages
      console.error("Signup error:", error);
    }
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
                placeholder="Email"
                value={user.email}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Username"
                value={user.username}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={user.password}
                onChange={handleChange}
                required
              />
              <button type="submit" className="signup-button">
                Register
              </button>
            </form>
            <div className="signup-options">
              <a href="/login" className="login-link">
                Have an Account? Log In
              </a>
            </div>
            <div className="social-signup">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
