import {
  FETCH_TESTS_REQUEST,
  FETCH_TESTS_SUCCESS,
  FETCH_TESTS_FAILURE,
} from "./actionTypes";

const fetchTestsRequest = () => ({
  type: FETCH_TESTS_REQUEST,
});

const fetchTestsSuccess = (tests) => ({
  type: FETCH_TESTS_SUCCESS,
  payload: tests,
});

const fetchTestsFailure = (error) => ({
  type: FETCH_TESTS_FAILURE,
  payload: error,
});

export const fetchTests = () => {
  return async (dispatch) => {
    dispatch(fetchTestsRequest());
    try {
      const response = await fetch("/api/tests/all");
      const data = await response.json();
      dispatch(fetchTestsSuccess(data));
    } catch (error) {
      dispatch(fetchTestsFailure(error.message));
    }
  };
};
