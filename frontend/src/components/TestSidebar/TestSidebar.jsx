import React from "react";
import "./TestSidebar.css";

const TestSidebar = ({ onSelectSection }) => {
  return (
    <div className="test-sidebar">
      <button className="sidebar-button" onClick={() => onSelectSection("mcq")}>
        MCQ
      </button>
      <button
        className="sidebar-button"
        onClick={() => onSelectSection("programming")}
      >
        Programming
      </button>
    </div>
  );
};

export default TestSidebar;
