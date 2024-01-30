import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanyTests } from "../../redux/test/testActions";
import TestCard from "../../components/TestCard/TestCard";
import "./CompanyTestsDisplay.css";
const CompanyTestsDisplay = () => {
  const dispatch = useDispatch();
  const companyId = useSelector((state) => state.auth.user._id);
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
      {companyTests.map((test) => (
        <TestCard key={test._id} test={test} />
      ))}
    </div>
  );
};

export default CompanyTestsDisplay;
