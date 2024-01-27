import {
  fetchTestRequest,
  fetchTestSuccess,
  fetchTestFailure,
} from "./testDetailsSlice";
import apiClient from "../../services/apiConfig";

export const fetchTestById = (testId) => async (dispatch) => {
  dispatch(fetchTestRequest());
  try {
    const response = await apiClient.get(`/api/tests/${testId}`);
    dispatch(fetchTestSuccess(response.data));
  } catch (error) {
    dispatch(fetchTestFailure(error.message));
  }
};

export const submitTestAnswers = async (testId, answers, dispatch) => {
  dispatch(fetchTestRequest());
  try {
    const response = await apiClient.post(
      `/api/tests/submit/${testId}`,
      answers
    );
    console.log("Submitted test answers:", response.data);
  } catch (error) {
    dispatch(fetchTestFailure(error.message));
  }
};
