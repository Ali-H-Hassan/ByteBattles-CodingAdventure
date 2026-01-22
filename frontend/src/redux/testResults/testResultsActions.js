import {
  fetchResultsRequest,
  fetchResultsSuccess,
  fetchResultsFailure,
  submitTestRequest,
  submitTestSuccess,
  submitTestFailure,
} from "./testResultsSlice";
import apiClient from "../../services/apiConfig";

export const fetchUserResults = () => async (dispatch) => {
  dispatch(fetchResultsRequest());
  try {
    const response = await apiClient.get("/api/test-results/my-results");
    dispatch(fetchResultsSuccess(response.data));
  } catch (error) {
    dispatch(fetchResultsFailure(error.response?.data?.message || error.message));
  }
};

export const submitTest = (testId, answers) => async (dispatch) => {
  dispatch(submitTestRequest());
  try {
    const response = await apiClient.post(`/api/test-results/submit/${testId}`, answers);
    dispatch(submitTestSuccess(response.data));
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(submitTestFailure(errorMessage));
    throw new Error(errorMessage);
  }
};

export const checkIfTestTaken = (testId) => async () => {
  try {
    const response = await apiClient.get(`/api/test-results/has-taken/${testId}`);
    return response.data.hasTaken;
  } catch (error) {
    console.error("Error checking if test is taken:", error);
    return false;
  }
};

export const getTestResult = (testId) => async () => {
  try {
    const response = await apiClient.get(`/api/test-results/test/${testId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching test result:", error);
    return null;
  }
};

