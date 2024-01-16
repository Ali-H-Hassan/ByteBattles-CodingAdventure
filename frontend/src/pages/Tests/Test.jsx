import React from "react";
import { useSelector } from "react-redux";
import Header from "../../components/DashHeader/DashHeader";
import TestCard from "../../components/TestCard/TestCard";
import "./Test.css";
import Amazon from "../../assets/amazon.png";

const TestsPage = () => {
  const user = useSelector((state) => state.auth.user);
  const username = user ? user.username : "User";

  const testData = Array(6).fill({
    logo: Amazon,
    title: "Amazon Model Test",
    subtitle: "MTSL Campus Drive-2023",
    status: "Upcoming",
  });
  const profilePic = user?.profilePictureUrl;
  return (
    <div className="tests-page-container">
      <div className="main-content">
        <Header username={username} profilePic={profilePic} />
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
