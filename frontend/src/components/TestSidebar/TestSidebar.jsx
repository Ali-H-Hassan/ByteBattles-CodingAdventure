import React from "react";
import "./TestSidebar.css";

const TestSidebar = ({ currentSection, onSelectSection }) => {
  const handleSelect = (section) => {
    if (typeof onSelectSection === "function") {
      onSelectSection(section);
    }
  };

  return (
    <div className="test-sidebar">
      <button
        className={`sidebar-button ${
          currentSection === "mcq" ? "selected" : ""
        }`}
        onClick={() => handleSelect("mcq")}
      >
        MCQ
      </button>
      <button
        className={`sidebar-button ${
          currentSection === "programming" ? "selected" : ""
        }`}
        onClick={() => handleSelect("programming")}
      >
        Coding
      </button>
    </div>
  );
};

export default TestSidebar;
