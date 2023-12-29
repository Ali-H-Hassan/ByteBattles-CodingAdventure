import React from "react";
import { AuthProvider } from "./context/AuthContext"; // Import the AuthProvider
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Login from "./pages/LoginPage/LoginPage";
import Signup from "./pages/SignupPage/signupPage";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      {" "}
      {/* Wrap your components with AuthProvider */}
      <div className="App">
        <Login />
        {/* The rest of your components will go here. 
            For example, if you're using react-router-dom, 
            your route definitions would be here. */}
      </div>
    </AuthProvider>
  );
}

export default App;
