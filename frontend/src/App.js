import React from "react";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Login from "./pages/LoginPage/LoginPage";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Login />
      {/* The rest of your components will go here. 
          For example, if you're using react-router-dom, 
          your route definitions would be here. */}
    </div>
  );
}

export default App;
