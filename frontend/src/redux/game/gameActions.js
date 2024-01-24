import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/apiConfig";

export const submitScore = createAsyncThunk(
  "game/submitScore",
  async ({ userId, score }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/game/submit-score", {
        userId,
        score,
      });
      return response.data.highScore;
    } catch (error) {
      console.error("Error submitting score:", error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchCoursesAsync = createAsyncThunk(
  "game/fetchCourses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/api/games/courses");
      return response.data;
    } catch (error) {
      console.error("Error fetching courses", error);
      return rejectWithValue(error.response.data);
    }
  }
);
