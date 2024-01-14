import React, { useState } from "react";
import ProblemStatement from "../../components/ProblemStatement/ProblemStatement";
import CodingEditor from "../../components/CodingEditor/CodingEditor";
import ResultsDisplay from "../../components/ResultsDisplay/ResultsDisplay";

const AIBattleMode = () => {
  const [userCode, setUserCode] = useState("");
  const [results, setResults] = useState(null);

  const handleCodeChange = (newCode) => {
    setUserCode(newCode);
  };

  const handleSubmit = async () => {
    // You would send the userCode to the backend and wait for the result
    // For now, we'll just simulate a result
    const simulatedResult = {
      user: { efficiency: 85, runTime: "0.5s" },
      ai: { efficiency: 95, runTime: "0.3s" },
    };
    setResults(simulatedResult);
  };

  return (
    <div>
      <ProblemStatement />
      <CodingEditor code={userCode} handleCodeChange={handleCodeChange} />
      <button onClick={handleSubmit}>Submit Code</button>
      {results && <ResultsDisplay results={results} />}
    </div>
  );
};

export default AIBattleMode;
