import React, { useState } from "react";
import ProblemStatement from "../../components/ProblemStatement/ProblemStatement";
import CodingEditor from "../../components/CodingEditor/CodingEditor";
import ResultsDisplay from "../../components/ResultsDisplay/ResultsDisplay";
import "./AIBattleMode.css";

const AIBattleMode = () => {
  const [userCode, setUserCode] = useState("");
  const [results, setResults] = useState(null);

  const handleCodeChange = (newCode) => {
    setUserCode(newCode);
  };

  const handleSubmit = async () => {
    const simulatedResult = {
      user: { efficiency: 85, runTime: "0.5s" },
      ai: { efficiency: 95, runTime: "0.3s" },
    };
    setResults(simulatedResult);
  };

  return (
    <div className="aibattle-mode-container">
      <h1>AI Battle Mode</h1>
      <ProblemStatement />
      <CodingEditor code={userCode} handleCodeChange={handleCodeChange} />
      <button className="aibattle-mode-submit-btn" onClick={handleSubmit}>
        Submit Code
      </button>
      {results && <ResultsDisplay results={results} />}
    </div>
  );
};

export default AIBattleMode;
