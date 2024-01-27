import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  courses: [],
};
export const gameSlice = createSlice({
  initialState,
  name: "game",
  reducers: {
    fetchCourses: (state, action) => {
      return {
        ...state,
        courses: action.payload,
      };
    },
  },
});
export const { fetchCourses } = gameSlice.actions;
export default gameSlice.reducer;
