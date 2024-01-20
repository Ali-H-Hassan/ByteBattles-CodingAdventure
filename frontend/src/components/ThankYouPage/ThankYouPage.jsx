import React from "react";
import { useNavigate } from "react-router-dom";
import TestHeader from "../../components/TestHeader/TestHeader";
import Thanks from "../../assets/illustration.png";
import "./ThankYouPage.css";

const ThankYouPage = () => {
  const navigate = useNavigate();

  const returnToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="thank-you-page-container">
      <TestHeader timeLeft="00:00:00" />
      <div className="thank-you-content">
        <h1>Thanks For Participating</h1>
        <p>Your Test Has Completed!</p>
        <img src={Thanks} alt="Completed" className="thank-you-image" />
        <p>You will be notified when your test results are released</p>
        <button className="thank-you-return-button" onClick={returnToDashboard}>
          Return Home
        </button>
      </div>
    </div>
  );
};

export default ThankYouPage;
