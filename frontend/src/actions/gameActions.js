import apiClient from "../services/apiConfig";
import { SUBMIT_SCORE, FETCH_COURSES } from "./actionTypes";

export const submitScore = (userId, score) => async (dispatch) => {
  try {
    const response = await apiClient.post("/game/submit-score", {
      userId,
      score,
    });
    dispatch({
      type: SUBMIT_SCORE,
      payload: response.data.highScore,
    });
  } catch (error) {
    console.error("Error submitting score:", error);
  }
};

export const fetchCourses = () => async (dispatch) => {
  try {
    const response = await apiClient.get("/api/games/courses");
    dispatch({
      type: FETCH_COURSES,
      payload: response.data,
    });
  } catch (error) {
    console.error("Error fetching courses", error);
  }
};
