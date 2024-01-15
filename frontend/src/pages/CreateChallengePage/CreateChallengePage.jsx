import React, { useState } from "react";
import { createChallenge } from "../../actions/actionTypes"; // Import your action creator

const CreateChallengePage = () => {
  const [challengeData, setChallengeData] = useState({
    title: "",
    description: "",
    difficulty: "",
    // ...other fields
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChallengeData({ ...challengeData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Call the action creator to dispatch the challenge creation
    createChallenge(challengeData);
  };

  return (
    <div>
      <h2>Create a New Challenge</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          value={challengeData.title}
          onChange={handleChange}
          placeholder="Title"
        />
        {/* Add inputs for description, difficulty, etc. */}
        <button type="submit">Create Challenge</button>
      </form>
    </div>
  );
};

export default CreateChallengePage;
