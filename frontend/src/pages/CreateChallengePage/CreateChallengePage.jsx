import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createChallenge } from "../../actions/challengeActions";

const CreateChallengePage = () => {
  const [challengeData, setChallengeData] = useState({
    title: "",
    description: "",
    difficulty: "",
  });

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChallengeData({ ...challengeData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createChallenge(challengeData));
  };

  return (
    <div className="create-challenge-container">
      <h2 className="create-challenge-title">Create a New Challenge</h2>
      <form className="create-challenge-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            id="title"
            name="title"
            className="form-input"
            value={challengeData.title}
            onChange={handleChange}
            placeholder="Title"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="form-textarea"
            value={challengeData.description}
            onChange={handleChange}
            placeholder="Description"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="difficulty" className="form-label">
            Difficulty
          </label>
          <select
            id="difficulty"
            name="difficulty"
            className="form-select"
            value={challengeData.difficulty}
            onChange={handleChange}
            required
          >
            <option value="">Select Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <button className="create-challenge-button" type="submit">
          Create Challenge
        </button>
      </form>
    </div>
  );
};

export default CreateChallengePage;
