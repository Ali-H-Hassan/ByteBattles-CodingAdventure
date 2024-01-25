import React, { useState, useEffect } from "react";
import ProblemStatement from "../../components/ProblemStatement/ProblemStatement";
import CodingEditor from "../../components/CodingEditor/CodingEditor";
import ResultsDisplay from "../../components/ResultsDisplay/ResultsDisplay";
import "./AIBattleMode.css";

const AIBattleMode = () => {
  const [userCode, setUserCode] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [challenge, setChallenge] = useState(null);

  const challengeId = "65b235cc0ad22968eb78b484";

  useEffect(() => {
    const fetchChallengeById = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/challenges/${challengeId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setChallenge(data);
      } catch (error) {
        console.error("Error fetching challenge by ID:", error);
      }
    };

    fetchChallengeById();
  }, [challengeId]);

  const handleCodeChange = (newCode) => {
    setUserCode(newCode);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const requestBody = {
      userId: "65a9ceb139fc17bf0de542ad",
      challengeId: challengeId,
      userCode: userCode,
      language: "javascript",
    };

    try {
      const response = await fetch("http://localhost:3000/api/battle/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);
      setResults(result);
    } catch (error) {
      console.error("There was an error submitting the code:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="aibattle-mode-container">
      <h1>AI Battle Mode</h1>
      {challenge && <ProblemStatement challenge={challenge} />}
      <CodingEditor code={userCode} handleCodeChange={handleCodeChange} />
      <button
        className="aibattle-mode-submit-btn"
        onClick={handleSubmit}
        disabled={loading || !challenge}
      >
        {loading ? "Submitting..." : "Submit Code"}
      </button>
      {results && <ResultsDisplay results={results} />}
    </div>
  );
};

export default AIBattleMode;
