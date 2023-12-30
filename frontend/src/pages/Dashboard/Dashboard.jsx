// import React from "react";
// import { Link } from "react-router-dom";
// import "./Dashboard.css";
// import ProfileImage from "../../assets/illustration.png";
// import SearchIcon from "../../assets/search-icon.png";
// const Dashboard = () => {
//   // Dummy data, replace with actual data from your state or props
//   const username = "Ali";
//   const recentTests = [
//     { id: 1, title: "C Programming", progress: 75 },
//     { id: 2, title: "Python Programming", progress: 25 },
//   ];
//   const leaderboardData = [
//     { id: 1, name: "SpongeBob", score: 98 },
//     { id: 2, name: "Patrick Star", score: 89 },
//     { id: 3, name: "Sandy Cheeks", score: 85 },
//   ];
//   const statsData = {
//     testsWritten: 32,
//     passed: 12,
//     failed: 19,
//     averageScore: 38,
//   };
//   return (
//     <div className="dashboard">
//       <aside className="sidebar">
//         <div className="logo">
//           <Link to="/">Byte Battle</Link>
//         </div>
//         <nav className="nav">
//           <Link to="/dashboard" className="nav-item">
//             Dashboard
//           </Link>
//           <Link to="/tests" className="nav-item">
//             Tests
//           </Link>
//           <Link to="/courses" className="nav-item">
//             Courses
//           </Link>
//           <Link to="/profile" className="nav-item">
//             Profile
//           </Link>
//           <Link to="/leaderboard" className="nav-item">
//             Leaderboard
//           </Link>
//           <button className="nav-item dark-mode">Dark Mode</button>
//           <Link to="/logout" className="nav-item">
//             Log Out
//           </Link>
//         </nav>
//       </aside>
//       <main className="dashboard-main">
//         <header className="dashboard-header">
//           <div className="welcome-message">
//             <h2>Welcome {username}!</h2>
//             <div className="search-bar">
//               <input type="text" placeholder="Search..." />
//               <button className="search-button">
//                 <img src={SearchIcon} alt="Search" />
//               </button>
//             </div>
//           </div>
//         </header>
//         <section className="recent-tests">
//           {recentTests.map((test) => (
//             <RecentTestCard
//               key={test.id}
//               title={test.title}
//               progress={test.progress}
//             />
//           ))}
//         </section>
//         <section className="leaderboard">
//           {leaderboardData.map((entry) => (
//             <LeaderboardItem
//               key={entry.id}
//               name={entry.name}
//               score={entry.score}
//             />
//           ))}
//         </section>
//         <section className="stats">
//           <StatCard label="Tests Written" value={statsData.testsWritten} />
//           <StatCard label="Passed" value={statsData.passed} />
//           <StatCard label="Failed" value={statsData.failed} />
//           <StatCard
//             label="Average Score"
//             value={`${statsData.averageScore}%`}
//           />
//         </section>
//       </main>
//     </div>
//   );
// };

// export default Dashboard;
