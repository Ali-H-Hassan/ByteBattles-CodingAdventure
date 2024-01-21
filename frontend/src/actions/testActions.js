import * as actionTypes from "./actionTypes";
import apiClient from "../services/apiConfig";

const fetchTestsRequest = () => ({
  type: actionTypes.FETCH_TESTS_REQUEST,
});

const fetchTestsSuccess = (tests) => ({
  type: actionTypes.FETCH_TESTS_SUCCESS,
  payload: tests,
});

const fetchTestsFailure = (error) => ({
  type: actionTypes.FETCH_TESTS_FAILURE,
  payload: error,
});

export const fetchTests = () => {
  return async (dispatch) => {
    dispatch(fetchTestsRequest());
    try {
      const response = await apiClient.get("/api/tests/all");
      console.log("fetchTests response data:", response.data);
      dispatch(fetchTestsSuccess(response.data));
    } catch (error) {
      console.error("fetchTests error:", error);
      dispatch(fetchTestsFailure(error.message));
    }
  };
};
const fetchTestById = (testId) => async (dispatch) => {
  dispatch(fetchTestsRequest());
  try {
    const response = await apiClient.get(`/tests/${testId}`);
    dispatch({ type: actionTypes.FETCH_TEST_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: actionTypes.FETCH_TEST_FAILURE, payload: error.message });
  }
};
const submitTestAnswers = (testId, answers) => async (dispatch) => {
  dispatch({ type: actionTypes.SUBMIT_TEST_REQUEST });
  try {
    const response = await apiClient.post(`/tests/${testId}/submit`, answers);
    dispatch({ type: actionTypes.SUBMIT_TEST_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: actionTypes.SUBMIT_TEST_FAILURE, payload: error.message });
  }
};
