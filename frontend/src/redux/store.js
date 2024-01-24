import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import gameReducer from "./game/gameSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    game: gameReducer,
  },
});
