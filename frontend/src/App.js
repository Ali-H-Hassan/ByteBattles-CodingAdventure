import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "../src/pages/LoginPage/LoginPage";
import Signup from "../src/pages/SignupPage/signupPage";
import WelcomePage from "../src/pages/WelcomePage/WelcomePage";
import GoogleAuthHandler from "./pages/GoogleAuthHandler";
import "./App.css";
import GoogleCallbackHandler from "./pages/GoogleCallbackHandler";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<WelcomePage />} />{" "}
            {/* Add WelcomePage as the root route */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/auth/google/callback"
              element={<GoogleAuthHandler />}
            />
            {/* Define other routes as needed */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
