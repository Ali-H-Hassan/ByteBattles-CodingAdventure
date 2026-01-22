import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import gameReducer from "./game/gameSlice";
import testReducer from "./test/testSlice";
import testDetailsReducer from "./testDetails/testDetailsSlice";
import testResultsReducer from "./testResults/testResultsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    game: gameReducer,
    test: testReducer,
    testDetails: testDetailsReducer,
    testResults: testResultsReducer,
  },
});
