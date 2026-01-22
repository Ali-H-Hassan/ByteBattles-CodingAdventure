import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTestById } from "../../redux/testDetails/testDetailsActions";
import { checkIfTestTaken } from "../../redux/testResults/testResultsActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import "./TestCard.css";
import defaultLogo from "../../assets/DefaultLogo.jpeg";

const TestCard = ({ test }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isTaken, setIsTaken] = useState(false);
  const [checking, setChecking] = useState(true);
  const userId = useSelector((state) => state.auth.user?.id || state.auth.user?._id);

  useEffect(() => {
    const checkTestStatus = async () => {
      if (!test || !userId) {
        setChecking(false);
        return;
      }

      const testId = test.id || test._id;
      if (!testId) {
        setChecking(false);
        return;
      }

      try {
        const taken = await dispatch(checkIfTestTaken(testId));
        setIsTaken(taken);
      } catch (error) {
        console.error("Error checking test status:", error);
      } finally {
        setChecking(false);
      }
    };

    checkTestStatus();
  }, [test, userId, dispatch]);

  if (!test) {
    return null;
  }

  const {
    id: testId,
    _id: mongoId,
    logo = defaultLogo,
    title = "No Title",
    companyName,
  } = test;
  const id = testId || mongoId; // Support both id (SQL) and _id (MongoDB)

  const handleTakeTest = (e) => {
    e.stopPropagation();
    if (id && !isTaken) {
      dispatch(fetchTestById(id));
      navigate(`/tests/${id}`);
    }
  };

  return (
    <div className="test-card-main">
      <div className="test-card-body">
        <img src={logo} alt={`${title} logo`} className="test-logo" />
        <div className="test-card-content">
          <h3 className="test-title">{title}</h3>
          {companyName && (
            <div className="test-company">
              <FontAwesomeIcon icon={faBuilding} className="test-company-icon" />
              <span className="test-company-name">{companyName}</span>
            </div>
          )}
        </div>
        <button 
          className={`test-take-button ${isTaken ? "test-taken-button" : ""}`}
          onClick={handleTakeTest}
          disabled={isTaken || checking}
        >
          {checking ? (
            "Checking..."
          ) : isTaken ? (
            <>
              <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: "0.5rem" }} />
              Already Taken
            </>
          ) : (
            "Take Test"
          )}
        </button>
      </div>
    </div>
  );
};

export default TestCard;
