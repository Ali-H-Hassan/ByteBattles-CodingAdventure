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
      dispatch(fetchTestsSuccess(response.data));
    } catch (error) {
      dispatch(fetchTestsFailure(error.message));
    }
  };
};

export const fetchTestById = (testId) => async (dispatch) => {
  dispatch(fetchTestsRequest());
  try {
    const response = await apiClient.get(`/api/tests/${testId}`);
    dispatch({ type: actionTypes.FETCH_TEST_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: actionTypes.FETCH_TEST_FAILURE, payload: error.message });
  }
};

export const submitTestAnswers = (testId, answers) => async (dispatch) => {
  dispatch({ type: actionTypes.SUBMIT_TEST_REQUEST });
  try {
    const response = await apiClient.post(
      `/api/tests/submit/${testId}`,
      answers
    );
    dispatch({ type: actionTypes.SUBMIT_TEST_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: actionTypes.SUBMIT_TEST_FAILURE, payload: error.message });
  }
};
