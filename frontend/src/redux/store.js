import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import gameReducer from "./game/gameSlice";
import testReducer from "./test/testSlice";
import testDetailsReducer from "./testDetails/testDetailsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    game: gameReducer,
    test: testReducer,
    testDetails: testDetailsReducer,
  },
});
