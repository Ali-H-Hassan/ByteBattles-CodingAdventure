import React from "react";
import OnlineTestIllustration from "../../assets/illustration.png";
import ProgrammerIllustration from "../../assets/SignUpImg.png";
import "./WelcomePage.css";
const WelcomeSectionOne = () => {
  return (
    <div>
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
              Backend, Software Engineering, and more. Dive into tutorial
              levels, master the basics, and gear up for epic coding challenges.
              The journey to coding mastery starts here!
            </p>
            <button className="cta-button">Create Account</button>
          </div>
          <div className="image-content">
            <img src={OnlineTestIllustration} alt="Online Test" />
          </div>
        </div>
      </section>
      <section className="welcome-section-two">
        <div className="section-two-content-container">
          <div className="section-two-text-content">
            <h2>Companies & Candidates</h2>
            <p>
              Not only does ByteBattle prepare candidates for technical
              interviews, we also help companies identify top technical talent.
              From sponsoring contests to providing online assessments and
              training, we offer numerous services to businesses.
            </p>
            <button className="section-two-cta-button">
              Business Opportunities
            </button>
          </div>
          <div className="section-two-image-content">
            <img src={ProgrammerIllustration} alt="Programmer" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default WelcomeSectionOne;
