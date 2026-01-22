import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchTestById } from "../../redux/testDetails/testDetailsActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding } from "@fortawesome/free-solid-svg-icons";
import "./TestCard.css";
import defaultLogo from "../../assets/DefaultLogo.jpeg";

const TestCard = ({ test }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    if (id) {
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
        <button className="test-take-button" onClick={handleTakeTest}>
          Take Test
        </button>
      </div>
    </div>
  );
};

export default TestCard;
