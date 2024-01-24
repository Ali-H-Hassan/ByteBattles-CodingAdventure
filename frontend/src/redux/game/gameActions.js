import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../services/apiConfig";
import { fetchCourses } from "./gameSlice"; // Ensure you have a fetchCourses action in your gameSlice

// This action is used to submit scores
export const submitScore = createAsyncThunk(
  "game/submitScore",
  async ({ userId, score }, { dispatch }) => {
    try {
      const response = await apiClient.post("/game/submit-score", {
        userId,
        score,
      });
      // Assuming you have a corresponding reducer or extraReducer to handle this action
      dispatch(fetchCourses.fulfilled(response.data.highScore));
    } catch (error) {
      console.error("Error submitting score:", error);
      return Promise.reject(error);
    }
  }
);

// This action is used to fetch courses
export const fetchCoursesAsync = createAsyncThunk(
  "game/fetchCourses",
  async (_, { dispatch }) => {
    try {
      const response = await apiClient.get("/api/games/courses");
      // No need to dispatch here; it's handled automatically by createAsyncThunk
      return response.data;
    } catch (error) {
      console.error("Error fetching courses", error);
      return Promise.reject(error);
    }
  }
);
