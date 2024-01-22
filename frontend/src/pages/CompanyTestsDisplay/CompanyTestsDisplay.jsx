import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanyTests } from "../../actions/testActions";
import TestCard from "../../components/TestCard/TestCard";

const CompanyTestsDisplay = () => {
  const dispatch = useDispatch();
  const { tests, loading, error } = useSelector((state) => state.companyTests);

  useEffect(() => {
    dispatch(fetchCompanyTests());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!tests.length) return <div>No tests found</div>;

  return (
    <div className="company-tests-display">
      {tests.map((test) => (
        <TestCard key={test._id} test={test} />
      ))}
    </div>
  );
};

export default CompanyTestsDisplay;
