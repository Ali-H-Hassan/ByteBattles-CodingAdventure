import * as actionTypes from "./actionTypes";

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
      const response = await fetch("/api/tests/all");
      const data = await response.json();
      dispatch(fetchTestsSuccess(data));
    } catch (error) {
      dispatch(fetchTestsFailure(error.message));
    }
  };
};
