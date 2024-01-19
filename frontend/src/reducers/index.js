import { combineReducers } from "redux";
import authReducer from "./authReducer";
import gameReducer from "./gameReducer";
import testReducer from "./testReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  game: gameReducer,
  test: testReducer,
});

export default rootReducer;
