import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTests } from "../../redux/test/testActions";
import TestCard from "../../components/TestCard/TestCard";
import "./Test.css";

const TestsPage = () => {
  const dispatch = useDispatch();
  const { loading, tests, error } = useSelector((state) => state.test);

  useEffect(() => {
    dispatch(fetchTests());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!tests || tests.length === 0)
    return <div>No tests found</div>;

  return (
    <div className="tests-display">
      {tests.map((test) => {
        const testId = test.id || test._id; // Support both id (SQL) and _id (MongoDB)
        return <TestCard key={testId} test={test} />;
      })}
    </div>
  );
};

export default TestsPage;
