import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/LoginPage/LoginPage";
import Signup from "./pages/SignupPage/signupPage";
import WelcomePage from "./pages/WelcomePage/WelcomePage";
import Dashboard from "./pages/Dashboard/Dashboard";
import CompanyDashboard from "./pages/CompanyDashboard/CompanyDashboard";
import GamePage from "./pages/GamePage";
import CreateTestPage from "./pages/CreateTestPage/CreateTestPage";
import DisplayTest from "./pages/DisplayTest/DisplayTest";
import ProtectedRoute from "./ProtectedRoute";
import { Provider, useDispatch } from "react-redux";
import { store } from "./redux/store";
import { restoreUserSession } from "./redux/auth/authActions";
import "./App.css";
import ThankYouPage from "./components/ThankYouPage/ThankYouPage";

// Component to restore session on app load
function AppInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Restore user session from token on app initialization
    dispatch(restoreUserSession());
  }, [dispatch]);

  return <>{children}</>;
}

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <AppInitializer>
            <div className="App">
              <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route
                    path="/company-dashboard"
                    element={<CompanyDashboard />}
                  />
                  <Route path="/game" element={<GamePage />} />
                  <Route path="/create-test" element={<CreateTestPage />} />
                  <Route path="/tests/:testId" element={<DisplayTest />} />
                </Route>
                <Route path="/thank-you" element={<ThankYouPage />} />
              </Routes>
            </div>
          </AppInitializer>
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;
