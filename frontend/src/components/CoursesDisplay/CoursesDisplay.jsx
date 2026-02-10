import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoursesAsync } from "../../redux/game/gameActions";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faLaptopCode,
  faServer,
  faRocket,
  faTrophy,
  faGamepad
} from "@fortawesome/free-solid-svg-icons";
import "./CoursesDisplay.css";
import htmlImage from "../../assets/html_course_image.png";
import cssImage from "../../assets/css_course_image.png";
import nodejsImage from "../../assets/nodejs_course_image.png";
import pythonImage from "../../assets/python_course_image.png";

const GamepadSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-gamepad-2"
  >
    <line x1="6" y1="11" x2="10" y2="11" />
    <line x1="8" y1="9" x2="8" y2="13" />
    <line x1="15" y1="12" x2="15.01" y2="12" />
    <line x1="18" y1="10" x2="18.01" y2="10" />
    <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" />
  </svg>
);

const CourseSection = ({ title, courses, icon }) => {
  const [activeCourse, setActiveCourse] = useState(null);
  const navigate = useNavigate();

  const handleCardClick = (courseId) => {
    setActiveCourse(activeCourse === courseId ? null : courseId);
  };

  const startGame = (courseId) => {
    navigate("/game", { state: { courseId: courseId } });
  };

  const updatedCourses = courses.map((course) => {
    switch (course.title) {
      case "HTML Basics":
        return { ...course, imageUrl: htmlImage };
      case "CSS Fundamentals":
        return { ...course, imageUrl: cssImage };
      case "NodeJs Basics":
        return { ...course, imageUrl: nodejsImage };
      case "Python Fundamentals":
        return { ...course, imageUrl: pythonImage };
      default:
        return course;
    }
  });

  return (
    <div className="course-section">
      <div className="course-section-header">
        <div className="course-section-icon">
          <FontAwesomeIcon icon={icon} />
        </div>
        <div className="course-section-info">
          <h2 className="course-section-title">{title}</h2>
          <span className="course-section-count">{courses.length} courses available</span>
        </div>
      </div>
      <div className="courses-display-container">
        {updatedCourses.map((course) => {
          const courseId = course.id || course._id;
          return (
            <div
              key={courseId}
              className={`courses-display-card ${
                activeCourse === courseId ? "courses-display-card-active" : ""
              }`}
              onClick={() => handleCardClick(courseId)}
            >
              <img
                className="courses-display-background"
                src={course.imageUrl}
                alt={course.title}
              />
              <div className="courses-display-card-content">
                <div className="courses-display-profile-image">
                  <GamepadSVG />
                </div>
                <h3 className="courses-display-title">{course.title}</h3>
                {activeCourse === courseId && (
                  <button
                    className="new-neon-button"
                    onClick={() => startGame(courseId)}
                  >
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    Start Adventure
                  </button>
                )}
              </div>
              <div className="courses-display-backdrop"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CoursesDisplay = () => {
  const dispatch = useDispatch();
  const courses = useSelector((state) => state.game.courses);

  useEffect(() => {
    dispatch(fetchCoursesAsync());
  }, [dispatch]);

  if (!courses.length) {
    return <LoadingSpinner message="Loading courses..." />;
  }

  const frontendCourses = courses.filter(
    (course) => course.title.includes("HTML") || course.title.includes("CSS")
  );
  const backendCourses = courses.filter(
    (course) =>
      course.title.includes("NodeJs") || course.title.includes("Python")
  );

  return (
    <div className="courses-page">
      {/* Hero Header */}
      <div className="courses-hero">
        <div className="courses-hero-content">
          <div className="courses-hero-icon">
            <FontAwesomeIcon icon={faGraduationCap} />
          </div>
          <div className="courses-hero-text">
            <h1 className="courses-hero-title">Learning Adventures</h1>
            <p className="courses-hero-subtitle">
              Embark on your gamified coding journey
            </p>
          </div>
        </div>
        <div className="courses-hero-stats">
          <div className="courses-hero-stat">
            <FontAwesomeIcon icon={faGamepad} className="stat-icon" />
            <span className="stat-value">{courses.length}</span>
            <span className="stat-label">Courses</span>
          </div>
          <div className="courses-hero-stat">
            <FontAwesomeIcon icon={faTrophy} className="stat-icon" />
            <span className="stat-value">XP</span>
            <span className="stat-label">Rewards</span>
          </div>
          <div className="courses-hero-stat">
            <FontAwesomeIcon icon={faRocket} className="stat-icon" />
            <span className="stat-value">Fun</span>
            <span className="stat-label">Learning</span>
          </div>
        </div>
      </div>

      {/* Course Sections */}
      <div className="courses-content">
        <CourseSection
          title="Frontend Development"
          courses={frontendCourses}
          icon={faLaptopCode}
        />
        <CourseSection
          title="Backend Development"
          courses={backendCourses}
          icon={faServer}
        />
      </div>
    </div>
  );
};

export default CoursesDisplay;
