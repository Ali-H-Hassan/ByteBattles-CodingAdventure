import { fetchCourses } from "./gameSlice";
import apiClient from "../../services/apiConfig";

export const fetchCoursesAsync = () => async (dispatch) => {
  try {
    const response = await apiClient.get("/api/games/courses");
    dispatch(fetchCourses(response.data));
  } catch (error) {
    console.error("Error fetching courses:", error);
  }
};
export const submitScore = (scoreData) => ({
  type: "game/submitScore",
  payload: scoreData,
});
