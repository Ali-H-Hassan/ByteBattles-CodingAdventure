import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTests } from "../../redux/test/testActions";
import Header from "../../components/DashHeader/DashHeader";
import TestCard from "../../components/TestCard/TestCard";
import "./Test.css";
import DefaultLogo from "../../assets/DefaultLogo.jpeg";
import { useNavigate } from "react-router-dom";
const TestsPage = () => {
  const dispatch = useDispatch();
  const { loading, tests, error } = useSelector((state) => state.test);
  const user = useSelector((state) => state.auth.user);
  const username = user ? user.username : "User";
  const profilePic = user?.profilePictureUrl;
  const navigate = useNavigate();

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
        {tests.map((test) => (
          <TestCard key={test._id} test={test} />
        ))}
      </div>
    </div>
  );
};

export default TestsPage;
