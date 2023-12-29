// WelcomePage.jsx
import React from "react";
import OnlineTestIllustration from "../../assets/illustration.png";
import "./WelcomePage.css";
const WelcomeSectionOne = () => {
  return (
    <section className="welcome-section-one">
      <div className="content-container">
        <div className="text-content">
          <h1>
            <span className="green-text">A</span>
            <span className="white-text"> New Way </span>
            <span className="green-text">To Learn</span>
          </h1>
          <p>
            Embark on your coding adventure. Choose your path – Frontend,
            Backend, Software Engineering, and more. Dive into tutorial levels,
            master the basics, and gear up for epic coding challenges. The
            journey to coding mastery starts here!
          </p>
          <button className="cta-button">Create Account</button>
        </div>
        <div className="image-content">
          <img src={OnlineTestIllustration} alt="Online Test" />
        </div>
      </div>
    </section>
  );
};

export default WelcomeSectionOne;
