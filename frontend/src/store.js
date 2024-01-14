// src/store.js
import { createStore, applyMiddleware, compose } from "redux";
import { thunk } from "redux-thunk"; // Correct named import
import rootReducer from "./reducers"; // Adjust as necessary for your project

// For Redux DevTools Extension
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(thunk) // Use the thunk middleware
  )
);

export default store;
