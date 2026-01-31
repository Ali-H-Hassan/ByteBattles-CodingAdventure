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
    // Handle both array and non-array responses, and ensure it's always an array
    const results = Array.isArray(response.data) ? response.data : (response.data ? [response.data] : []);
    dispatch(fetchResultsSuccess(results));
  } catch (error) {
    // If 500 error and user has no results, treat as empty array instead of error
    if (error.response?.status === 500) {
      console.warn("Error fetching test results (likely no results yet):", error.response?.data?.message || error.message);
      dispatch(fetchResultsSuccess([]));
    } else {
      dispatch(fetchResultsFailure(error.response?.data?.message || error.message));
    }
  }
};

export const submitTest = (testId, answers) => async (dispatch) => {
  dispatch(submitTestRequest());
  try {
    const response = await apiClient.post(`/api/test-results/submit/${testId}`, answers);
    dispatch(submitTestSuccess(response.data));
    return response.data;
  } catch (error) {
    // Log comprehensive error details
    console.error("=== SUBMIT TEST ERROR ===");
    console.error("Status:", error.response?.status);
    console.error("Status Text:", error.response?.statusText);
    console.error("Error Message:", error.message);
    console.error("Test ID:", testId);
    console.error("Answers being sent:", JSON.stringify(answers, null, 2));
    
    if (error.response?.data) {
      console.error("Error Response Data (full):", error.response.data);
      console.error("Error Response Data (stringified):", JSON.stringify(error.response.data, null, 2));
      console.error("Error Message from backend:", error.response.data.message);
    } else {
      console.error("No response data - request may have failed before reaching server");
    }
    
    console.error("Full error object:", error);
    console.error("=========================");
    
    const errorMessage = error.response?.data?.message || error.message || "An error occurred while submitting the test";
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

export const fetchTestResultsByTestId = (testId) => async (dispatch) => {
  try {
    console.log("Fetching test results for testId:", testId);
    const response = await apiClient.get(`/api/test-results/test/${testId}/results`);
    console.log("API Response status:", response.status);
    console.log("API Response data:", response.data);
    // Ensure we return an array
    const data = response.data;
    return Array.isArray(data) ? data : (data ? [data] : []);
  } catch (error) {
    console.error("Error fetching test results - Status:", error.response?.status);
    console.error("Error fetching test results - Message:", error.response?.data?.message || error.message);
    console.error("Full error:", error);
    throw error;
  }
};

