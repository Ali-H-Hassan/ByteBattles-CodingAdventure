import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/LoginPage/LoginPage";
import Signup from "./pages/SignupPage/signupPage";
import WelcomePage from "./pages/WelcomePage/WelcomePage";
import GoogleAuthHandler from "./pages/GoogleAuthHandler";
import GoogleCallbackHandler from "./pages/GoogleCallbackHandler";
import Dashboard from "./pages/Dashboard/Dashboard";
import GamePage from "./pages/GamePage";
import CreateChallengePage from "./pages/CreateChallengePage/CreateChallengePage";
import { Provider } from "react-redux";
import store from "./store";
import "./App.css";
import DisplayTest from "./pages/DisplayTest/DisplayTest";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/game" element={<GamePage />} />
              <Route path="/test" element={<DisplayTest />} />
              <Route element={<ProtectedRoute />}>
                <Route
                  path="/create-challenge"
                  element={<CreateChallengePage />}
                />
              </Route>
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;
