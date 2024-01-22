import * as actionTypes from "./actionTypes";
import apiClient from "../services/apiConfig";
export const SET_CURRENT_TEST_ID = "SET_CURRENT_TEST_ID";
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
  console.log(`[Debug] Attempting to fetch test with ID: ${testId}`);
  dispatch({ type: actionTypes.FETCH_TEST_REQUEST });

  try {
    console.log(`[Debug] Making API request to /api/tests/${testId}`);
    const response = await apiClient.get(`/api/tests/${testId}`);
    console.log("[Debug] API response:", response.data);

    dispatch({ type: actionTypes.FETCH_TEST_SUCCESS, payload: response.data });
  } catch (error) {
    console.error("[Debug] Error in API request:", error);
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
export const setCurrentTestId = (testId) => ({
  type: SET_CURRENT_TEST_ID,
  payload: testId,
});

export const fetchCompanyTests = () => async (dispatch) => {
  try {
    const response = await apiClient.get("/api/tests/company");
    dispatch({
      type: actionTypes.FETCH_COMPANY_TESTS_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    console.error("Error fetching company tests:", error);
  }
};

const createTestRequest = () => ({
  type: actionTypes.CREATE_TEST_REQUEST,
});

const createTestSuccess = (test) => ({
  type: actionTypes.CREATE_TEST_SUCCESS,
  payload: test,
});

const createTestFailure = (error) => ({
  type: actionTypes.CREATE_TEST_FAILURE,
  payload: error,
});

export const createTest = (testData) => async (dispatch) => {
  dispatch(createTestRequest());
  try {
    const response = await apiClient.post("/api/tests/create", testData);
    dispatch(createTestSuccess(response.data));
  } catch (error) {
    dispatch(createTestFailure(error.message));
  }
};
