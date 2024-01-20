import React from "react";
import TestHeader from "../../components/TestHeader/TestHeader";

import "./ThankYouPage.css";

const ThankYouPage = () => {
  return (
    <div className="thank-you-page-container">
      <TestHeader timeLeft="00:00:00" />
      <div className="thank-you-content">
        <h1>Thanks For Participating</h1>
        <p>Your Test Has Completed!</p>
        <img
          src="/path-to-your-asset-folder/thank-you-image.png"
          alt="Completed"
          className="thank-you-image"
        />
        <p>You will be notified when your test results are released</p>
      </div>
    </div>
  );
};

export default ThankYouPage;
