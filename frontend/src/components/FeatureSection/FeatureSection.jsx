import React from "react";
import "./FeatureSection.css"; // Import the corresponding CSS file
import OnlineTestImage from "../../assets/illustration.png"; // Import the image from your assets folder and replace 'online-test-image.png' with the actual image filename

function FeatureSection() {
  return (
    <section className="feature-section">
      <div className="feature-text-content">
        <h1>A New Way To Learn</h1>
        <p>
          Embark On Your Coding Adventure. Choose Your Path – Frontend, Backend,
          Software Engineering, And More. Dive Into Tutorial Levels, Master The
          Basics, And Gear Up For Epic Coding Challenges. The Journey To Coding
          Mastery Starts Here!
        </p>
        <button className="create-account-btn">Create Account</button>
      </div>
      <div className="feature-image-content">
        <img src={OnlineTestImage} alt="Online Test Illustration" />
      </div>
    </section>
  );
}

export default FeatureSection;
