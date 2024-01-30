import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchTestById } from "../../redux/testDetails/testDetailsActions";
import "./TestCard.css";
import defaultLogo from "../../assets/DefaultLogo.jpeg";

const TestCard = ({ test }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!test) {
    return null;
  }

  const {
    _id: id,
    logo = defaultLogo,
    title = "No Title",
    status = "defaultStatus",
  } = test;

  const handleTestClick = () => {
    if (id) {
      dispatch(fetchTestById(id));
      navigate(`/tests/${id}`);
    }
  };

  return (
    <div className={`test-card-main ${status}`} onClick={handleTestClick}>
      <div className="test-card-header"></div>
      <div className="test-card-body">
        <img src={logo} alt={`${title} logo`} className="test-logo" />
        <h3 className="test-title">{title}</h3>
      </div>
    </div>
  );
};

export default TestCard;
