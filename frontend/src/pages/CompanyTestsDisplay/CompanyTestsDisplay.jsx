import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanyTests } from "../../actions/testActions";
import TestCard from "../../components/TestCard/TestCard";

const CompanyTestsDisplay = () => {
  const dispatch = useDispatch();

  // Use 'state.test' to match your rootReducer configuration
  const { companyTests, loading, error } = useSelector((state) => state.test);

  useEffect(() => {
    dispatch(fetchCompanyTests());
  }, [dispatch]);

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
