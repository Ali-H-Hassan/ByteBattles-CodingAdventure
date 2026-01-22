import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanyTests } from "../../redux/test/testActions";
import TestCard from "../../components/TestCard/TestCard";
import "./CompanyTestsDisplay.css";
const CompanyTestsDisplay = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const companyId = user?.id || user?._id; // Support both id (SQL) and _id (MongoDB)
  const { companyTests, loading, error } = useSelector((state) => state.test);

  useEffect(() => {
    console.log("Company ID:", companyId);
    if (companyId) {
      dispatch(fetchCompanyTests(companyId));
    }
  }, [dispatch]);

  useEffect(() => {
    console.log(companyTests);
  }, [companyTests]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!companyTests || companyTests.length === 0)
    return <div>No tests found</div>;

  return (
    <div className="company-tests-display">
      {companyTests.map((test) => {
        const testId = test.id || test._id; // Support both id (SQL) and _id (MongoDB)
        return <TestCard key={testId} test={test} />;
      })}
    </div>
  );
};

export default CompanyTestsDisplay;
