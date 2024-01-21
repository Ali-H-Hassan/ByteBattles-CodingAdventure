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
      // Corrected the endpoint from '/tests/all' to '/api/tests/all'
      const response = await apiClient.get("/api/tests/all");
      console.log("fetchTests response data:", response.data); // Log response data
      dispatch(fetchTestsSuccess(response.data));
    } catch (error) {
      console.error("fetchTests error:", error); // Log any errors
      dispatch(fetchTestsFailure(error.message));
    }
  };
};
