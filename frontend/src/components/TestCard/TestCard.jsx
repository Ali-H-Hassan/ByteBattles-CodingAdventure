import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentTestId } from "../../redux/test/testSlice";
import "./TestCard.css";

const TestCard = ({ id, logo, title, subtitle, status }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleTestClick = () => {
    dispatch(setCurrentTestId(id));
    navigate(`/tests/${id}`);
  };

  return (
    <div className={`test-card-main ${status}`} onClick={handleTestClick}>
      <div className="test-card-header"></div>
      <div className="test-card-body">
        <img src={logo} alt={`${title} logo`} className="test-logo" />
        <h3 className="test-title">{title}</h3>
        <p className="test-subtitle">{subtitle}</p>
      </div>
    </div>
  );
};

export default TestCard;
