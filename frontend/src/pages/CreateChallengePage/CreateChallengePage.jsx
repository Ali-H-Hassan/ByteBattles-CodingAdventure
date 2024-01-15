import React, { useState } from "react";
import { createChallenge } from "../../actions/challengeActions";

const CreateChallengePage = () => {
  const [challengeData, setChallengeData] = useState({
    title: "",
    description: "",
    difficulty: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChallengeData({ ...challengeData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        <button type="submit">Create Challenge</button>
      </form>
    </div>
  );
};

export default CreateChallengePage;
