import React from "react";
import CalendarIcon from "../../assets/CalendarIcon.png";

const UpcomingQuiz = () => {
  return (
    <section className="upcoming-quiz">
      <div className="upcoming-header">
        <h2 className="section-title">Upcoming Quiz Competition</h2>
        <img src={CalendarIcon} alt="Calendar" className="calendar-icon" />
      </div>
      <div className="quiz-details">
        <p className="quiz-date">12th Aug, 2023</p>
        <button className="register-button">Register Now</button>
      </div>
    </section>
  );
};

export default UpcomingQuiz;
