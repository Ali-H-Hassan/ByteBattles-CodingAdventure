import React from "react";
import TestHeader from "../../components/TestHeader/TestHeader";
import Thanks from "../../assets/illustration.png";
import "./ThankYouPage.css";

const ThankYouPage = () => {
  return (
    <div className="thank-you-page-container">
      <div className="thank-you-content">
        <h1>Thanks For Participating</h1>
        <p>Your Test Has Completed!</p>
        <img src={Thanks} alt="Completed" className="thank-you-image" />
        <p>You will be notified when your test results are released</p>
      </div>
    </div>
  );
};

export default ThankYouPage;
