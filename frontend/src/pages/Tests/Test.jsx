import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTests } from "../../actions/testActions";
import Header from "../../components/DashHeader/DashHeader";
import TestCard from "../../components/TestCard/TestCard";
import "./Test.css";
import Amazon from "../../assets/amazon.png";

const TestsPage = () => {
  const dispatch = useDispatch();
  const { loading, tests, error } = useSelector((state) => state.test);
  const user = useSelector((state) => state.auth.user);
  const username = user ? user.username : "User";
  const profilePic = user?.profilePictureUrl;

  useEffect(() => {
    dispatch(fetchTests());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="tests-page-container">
      <Header username={username} profilePic={profilePic} />
      <div className="tests-container">
        {tests.map((test, index) => (
          <TestCard
            key={test._id}
            logo={test.logo || Amazon}
            title={test.title}
            subtitle={test.subtitle}
            status={test.status}
          />
        ))}
      </div>
    </div>
  );
};

export default TestsPage;
