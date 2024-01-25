import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCompanyTests } from "../../redux/test/testActions";
import "./TotalTests.css";
import Tests from "../../assets/Edit 1.png";
import { useNavigate } from "react-router-dom";

function TotalTests() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const companyId = useSelector((state) => state.auth.user?.companyId);

  const companyTests = useSelector((state) => state.test.companyTests);
  const totalTests = companyTests.length;

  useEffect(() => {
    if (companyId) {
      dispatch(fetchCompanyTests(companyId));
    }
  }, [dispatch, companyId]);

  const handleCreateTestClick = () => {
    navigate("/create-test");
  };

  return (
    <div className="total-tests-container">
      <div className="total-tests-header">
        <img src={Tests} alt="Tests Icon" className="total-tests-icon" />
        <h2>Total Tests Created</h2>
      </div>
      <div className="total-tests-body">
        <p className="tests-number">{totalTests}</p>
        <p className="tests-subtext">Tests created by your company</p>
      </div>
      <div className="total-tests-footer">
        <button className="create-test-button" onClick={handleCreateTestClick}>
          Create New Test
        </button>
      </div>
    </div>
  );
}

export default TotalTests;
