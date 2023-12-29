// WelcomePage.jsx
import React from "react";
import FeatureSection from "../components/FeatureSection/FeatureSection";
import TestimonialSection from "../components/TestimonialSection/TestimonialSection";
import QuestionsSection from "../components/QuestionsSection/QuestionsSection";
import "./WelcomePage.css"; // Assuming you have corresponding CSS file for WelcomePage

const WelcomePage = () => {
  return (
    <div className="welcome-container">
      <section className="hero-section">
        {/* Content for the Hero section like title, subtitle, and call-to-action button */}
      </section>
      <FeatureSection />
      <TestimonialSection />
      <QuestionsSection />
      {/* Add more sections or components as needed based on your design */}
    </div>
  );
};

export default WelcomePage;
