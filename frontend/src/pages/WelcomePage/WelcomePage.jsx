import React from "react";
import { useNavigate } from "react-router-dom";
import OnlineTestIllustration from "../../assets/illustration.png";
import ProgrammerIllustration from "../../assets/SignUpImg.png";
import TestIllustration from "../../assets/LoginImg.png";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./WelcomePage.css";
const WelcomeSectionOne = () => {
  const navigate = useNavigate();
  const handleCreateAccountClick = () => {
    navigate("/signup");
  };
  return (
    <div className="welcome-page">
      <Header />
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
            <button className="cta-button" onClick={handleCreateAccountClick}>
              Create Account
            </button>
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
      <section className="welcome-section-one">
        <div className="content-container">
          <div className="text-content">
            <h1>
              <span className="green-text">Questions</span>
              <span className="white-text"> & </span>
              <span className="green-text">Contests</span>
            </h1>
            <p>
              Over 2800 questions for you to practice. Come and join one of the
              largest tech communities with hundreds of thousands of active
              users and participate in our contests to challenge yourself and
              earn rewards.
            </p>
            <button className="cta-button">View Tests</button>
          </div>
          <div className="image-content">
            <img src={TestIllustration} alt="Online Test" />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default WelcomeSectionOne;
