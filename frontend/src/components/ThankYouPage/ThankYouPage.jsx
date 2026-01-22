import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import "./ThankYouPage.css";

const ThankYouPage = () => {
  const navigate = useNavigate();

  const returnToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="thank-you-page-container">
      <div className="thank-you-content">
        <div className="thank-you-icon-wrapper">
          <FontAwesomeIcon icon={faCheckCircle} className="thank-you-icon" />
        </div>
        <h1 className="thank-you-title">Thank You!</h1>
        <p className="thank-you-subtitle">Your test has been submitted successfully</p>
        <p className="thank-you-message">You will be notified when your results are available</p>
        <button className="thank-you-return-button" onClick={returnToDashboard}>
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ThankYouPage;
