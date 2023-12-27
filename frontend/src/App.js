import React from "react";
import Header from "./components/Header/Header";
// Include your global styles if you have any, like this:
import "./App.css";

function App() {
  return (
    <div className="App">
      <Header />
      {/* The rest of your components will go here. 
          For example, if you're using react-router-dom, 
          your route definitions would be here. */}
    </div>
  );
}

export default App;
