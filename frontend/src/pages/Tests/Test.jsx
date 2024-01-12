import React from "react";
import DashHeader from "../../components/DashHeader/DashHeader";
import TestCard from "../../components/TestCard/TestCard";
import "./Test.css";
import Amazon from "../../assets/amazon.png";

const TestsPage = () => {
  // Create an array with six test items
  const testData = Array(6).fill({
    logo: Amazon,
    title: "Amazon Model Test",
    subtitle: "MTSL Campus Drive-2023",
    status: "Upcoming",
  });

  return (
    <div className="tests-page-container">
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
