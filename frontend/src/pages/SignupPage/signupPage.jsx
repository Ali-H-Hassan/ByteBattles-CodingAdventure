import React, { useState, useContext } from "react";
import Header from "../../components/Header/Header";
import { registerUser } from "../../services/authService"; // Import the registerUser function
import { AuthContext } from "../../context/AuthContext"; // Import AuthContext
import "./signupPage.css";
import SignUpImg from "../../assets/SignUpImg.png";
import FbCard from "../../assets/FacebookCard.png";
import GithCard from "../../assets/GithubCard.png";
import GgCard from "../../assets/GoogleCard.png";

const SignupPage = () => {
  // Use AuthContext
  const { setAuthState } = useContext(AuthContext);
  // State for the new user data
  const [newUser, setNewUser] = useState({
    email: "",
    username: "",
    password: "",
  });

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
      // Handle successful registration:
      // Update auth state, save the token, and redirect as necessary
      setAuthState({
        isAuthenticated: true,
        user: data.user,
        token: data.token,
      });
      // Redirect to the home page or dashboard after successful signup
    } catch (error) {
      // Handle registration errors, such as displaying an error message to the user
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
