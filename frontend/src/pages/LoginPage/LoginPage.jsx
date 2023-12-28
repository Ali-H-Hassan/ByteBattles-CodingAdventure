import Header from "../../components/Header/Header";
import { loginUser } from "../../services/authService";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./loginPage.css";
import LoginImg from "../../assets/LoginImg.png"; // Ensure assets are correctly imported
import FbCard from "../../assets/FacebookCard.png";
import GithCard from "../../assets/GithubCard.png";
import GgCard from "../../assets/GoogleCard.png";

const LoginPage = () => {
  const { setAuthState } = useContext(AuthContext); // Use setAuthState to update the global state
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

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
      // Redirect to home or dashboard page
    } catch (error) {
      // Display error message from response or default message
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
            />
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={handleChange}
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
            {/* Social login and other components */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
