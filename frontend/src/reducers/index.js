import { combineReducers } from "redux";
import authReducer from "./authReducer";
import todosReducer from "./todosReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  todos: todosReducer,
});

export default rootReducer;
