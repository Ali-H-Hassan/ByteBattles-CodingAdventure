import React, { useState } from "react";
import "./TestSidebar.css";

const TestSidebar = ({ onSelectSection }) => {
  const [selectedSection, setSelectedSection] = useState("mcq");

  const handleSelect = (section) => {
    setSelectedSection(section);
    onSelectSection(section);
  };

  return (
    <div className="test-sidebar">
      <button
        className={`sidebar-button ${
          selectedSection === "mcq" ? "selected" : ""
        }`}
        onClick={() => handleSelect("mcq")}
      >
        MCQ
      </button>
      <button
        className={`sidebar-button ${
          selectedSection === "programming" ? "selected" : ""
        }`}
        onClick={() => handleSelect("programming")}
      >
        Programming
      </button>
    </div>
  );
};

export default TestSidebar;
