import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchTestById } from "../../redux/testDetails/testDetailsActions";
import "./TestCard.css";
import defaultLogo from "../../assets/DefaultLogo.jpeg";

const TestCard = ({ test }) => {
  const { _id: id, logo, title, subtitle, status } = test;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleTestClick = () => {
    dispatch(fetchTestById(id));
    navigate(`/tests/${id}`);
  };

  const displayedLogo = logo || defaultLogo;

  return (
    <div className={`test-card-main ${status}`} onClick={handleTestClick}>
      <div className="test-card-header"></div>
      <div className="test-card-body">
        <img src={displayedLogo} alt={`${title} logo`} className="test-logo" />
        <h3 className="test-title">{title}</h3>
        <p className="test-subtitle">{subtitle}</p>
      </div>
    </div>
  );
};

export default TestCard;
