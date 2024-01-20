// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { createChallenge } from "../../actions/testActions";
// import "./CreateChallengePage.css";
// import { useSelector } from "react-redux";

// const CreateChallengePage = () => {
//   const [mcqData, setMcqData] = useState({
//     question: "",
//     options: ["", "", "", ""],
//     correctOption: "",
//   });
//   const token = useSelector((state) => state.auth.token);
//   const [codingData, setCodingData] = useState({
//     prompt: "",
//     templateCode: "",
//     testCases: ["", ""],
//   });

//   const dispatch = useDispatch();

//   const handleMcqChange = (e) => {
//     const { name, value } = e.target;
//     if (name.startsWith("option")) {
//       const index = parseInt(name.replace("option", ""), 10);
//       const updatedOptions = [...mcqData.options];
//       updatedOptions[index] = value;
//       setMcqData({ ...mcqData, options: updatedOptions });
//     } else {
//       setMcqData({ ...mcqData, [name]: value });
//     }
//   };

//   const handleCodingChange = (e) => {
//     const { name, value } = e.target;
//     setCodingData({ ...codingData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("Token in CreateChallengePage:", token);
//     if (!token) {
//       console.error("Authentication token is not available. Please log in.");
//       return;
//     }

//     const challengeData = {
//       mcq: mcqData,
//       coding: codingData,
//     };
//     dispatch(createChallenge(challengeData, token));
//   };

//   return (
//     <div className="create-challenge-container">
//       <h2 className="create-challenge-title">Create a New Test</h2>
//       <form className="create-challenge-form" onSubmit={handleSubmit}>
//         <div className="section mcq-section">
//           <fieldset>
//             <legend>MCQ Question</legend>
//             <label>
//               Question:
//               <input
//                 type="text"
//                 name="question"
//                 value={mcqData.question}
//                 onChange={handleMcqChange}
//                 required
//               />
//             </label>
//             {mcqData.options.map((option, index) => (
//               <label key={index}>
//                 Option {index + 1}:
//                 <input
//                   type="text"
//                   name={`option${index}`}
//                   value={option}
//                   onChange={handleMcqChange}
//                   required
//                 />
//               </label>
//             ))}
//             <label>
//               Correct Option Number:
//               <input
//                 type="number"
//                 name="correctOption"
//                 min="1"
//                 max="4"
//                 value={mcqData.correctOption}
//                 onChange={handleMcqChange}
//                 required
//               />
//             </label>
//           </fieldset>
//         </div>

//         <div className="section coding-section">
//           <fieldset>
//             <legend>Coding Question</legend>
//             <label>
//               Prompt:
//               <textarea
//                 name="prompt"
//                 value={codingData.prompt}
//                 onChange={handleCodingChange}
//                 required
//               />
//             </label>
//             <label>
//               Template Code:
//               <textarea
//                 name="templateCode"
//                 value={codingData.templateCode}
//                 onChange={handleCodingChange}
//                 required
//               />
//             </label>
//             {codingData.testCases.map((testCase, index) => (
//               <label key={index}>
//                 Test Case {index + 1}:
//                 <input
//                   type="text"
//                   name={`testCase${index}`}
//                   value={testCase}
//                   onChange={handleCodingChange}
//                 />
//               </label>
//             ))}
//           </fieldset>
//         </div>

//         <button className="create-challenge-button" type="submit">
//           Create Test
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CreateChallengePage;
