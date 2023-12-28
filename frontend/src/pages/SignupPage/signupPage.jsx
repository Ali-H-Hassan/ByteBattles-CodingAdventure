import React from "react";
import Header from "../../components/Header/Header";
import "./signupPage.css"; // Make sure this CSS file is specific to the signup page and contains the correct styles
import SignUpImg from "../../assets/SignUpImg.png"; // Assuming this is the correct image for the signup page
import FbCard from "../../assets/FacebookCard.png";
import GithCard from "../../assets/GithubCard.png";
import GgCard from "../../assets/GoogleCard.png";

const SignupPage = () => {
  // Renamed to SignupPage for clarity
  return (
    <div className="signup-page">
      {" "}
      {/* Changed class to signup-page */}
      <Header />
      <div className="signup-body">
        {" "}
        {/* Changed class to signup-body */}
        <div className="signup-image-section">
          {" "}
          {/* Changed class to signup-image-section */}
          <img src={SignUpImg} alt="Byte Battles Signup" />
        </div>
        <div className="signup-form-section">
          {" "}
          {/* Changed class to signup-form-section */}
          <div className="signup-container">
            {" "}
            {/* Changed class to signup-container */}
            <h2 className="signup-title">Byte Battle</h2>{" "}
            {/* Changed class to signup-title */}
            <input type="email" id="email" name="email" placeholder="Mail Id" />
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Username"
            />
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
            />
            <button type="submit" className="signup-button">
              Register
            </button>{" "}
            {/* Changed text to Register */}
            <div className="signup-options">
              <a href="#" className="login-link">
                Have an Account? Log In
              </a>{" "}
              {/* Updated text and class */}
            </div>
            <div className="social-signup">
              {" "}
              {/* Changed class to social-signup */}
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
                {" "}
                {/* Added class for styling */}
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

export default SignupPage; // Renamed to SignupPage
