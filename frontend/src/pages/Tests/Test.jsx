import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import DashHeader from "../../components/DashHeader/DashHeader";
import TestCard from "../../components/TestCard/TestCard";
import "./TestsPage.css";

const TestsPage = () => {
  // Placeholder for actual test data
  const testData = [
    {
      logo: "/path/to/tcs-logo.png",
      title: "TCS Quiz Competition",
      subtitle: "TCS Campus Drive-2023",
      status: "Upcoming",
    },
    // ... other test data
  ];

  return (
    <div className="tests-page-container">
      <Sidebar />
      <div className="main-content">
        <DashHeader />
        <div className="tests-container">
          {testData.map((test, index) => (
            <TestCard
              key={index}
              logo={test.logo}
              title={test.title}
              subtitle={test.subtitle}
              status={test.status}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestsPage;
