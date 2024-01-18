import { combineReducers } from "redux";
import authReducer from "./authReducer";
import challengeReducer from "./testReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  challenge: challengeReducer,
});

export default rootReducer;
