import { combineReducers } from "redux";
import authReducer from "./authReducer";
import challengeReducer from "./challengeReducer"; // Import the challenge reducer

const rootReducer = combineReducers({
  auth: authReducer,
  challenge: challengeReducer, // Add the challenge reducer here
});

export default rootReducer;
