import axios from "axios";
import { FETCH_COURSES } from "./actionTypes";

export const fetchCourses = () => async (dispatch) => {
  try {
    const response = await axios.get("/api/games/courses");
    dispatch({
      type: FETCH_COURSES,
      payload: response.data,
    });
  } catch (error) {
    console.error("Error fetching courses", error);
  }
};
