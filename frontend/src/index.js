import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

// Fix ResizeObserver loop error (benign error from Monaco Editor)
// This patches ResizeObserver to debounce notifications and prevent the error
const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

const OriginalResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends OriginalResizeObserver {
  constructor(callback) {
    super(debounce(callback, 20));
  }
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
