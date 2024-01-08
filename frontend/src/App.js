import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "../src/pages/LoginPage/LoginPage";
import Signup from "../src/pages/SignupPage/signupPage";
import WelcomePage from "../src/pages/WelcomePage/WelcomePage";
import GoogleAuthHandler from "./pages/GoogleAuthHandler";
import "./App.css";
import GoogleCallbackHandler from "./pages/GoogleCallbackHandler";
import Dashboard from "../src/pages/Dashboard/Dashboard";
import GamePage from "./pages/GamePage";
import Display from "../src/components/CoursesDisplay/CoursesDisplay";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<WelcomePage />} />{" "}
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/display" element={<Display />} />
            <Route
              path="/auth/google/callback"
              element={<GoogleAuthHandler />}
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
