// import React, { useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { fetchChallenge } from "../../actions/testActions";
// import "./DisplayTest.css";

// const DisplayTest = ({ testId }) => {
//   const dispatch = useDispatch();
//   const {
//     loading,
//     challenge: testData,
//     error,
//   } = useSelector((state) => state.challenge);

//   useEffect(() => {
//     dispatch(fetchChallenge(testId));
//   }, [dispatch, testId]);

//   if (loading) return <div className="test-loading">Loading test...</div>;
//   if (error)
//     return <div className="test-error">Error loading test: {error}</div>;
//   if (!testData)
//     return <div className="test-no-data">No test data available.</div>;

//   return (
//     <div className="test-display-container">
//       <h1 className="test-display-title">{testData.title}</h1>
//       <p className="test-display-description">{testData.description}</p>
//       <div className="test-display-questions">
//         {testData.questions.map((question, index) => (
//           <div key={index} className="test-display-question">
//             <h3>Question {index + 1}</h3>
//             <p className="test-display-question-text">
//               {question.questionText}
//             </p>
//             {question.options && (
//               <ul className="test-display-options">
//                 {question.options.map((option, idx) => (
//                   <li
//                     key={idx}
//                     className={
//                       option.isCorrect
//                         ? "test-display-option-correct"
//                         : "test-display-option"
//                     }
//                   >
//                     {option.text}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default DisplayTest;
