export const FETCH_TESTS_REQUEST = "FETCH_TESTS_REQUEST";
export const FETCH_TESTS_SUCCESS = "FETCH_TESTS_SUCCESS";
export const FETCH_TESTS_FAILURE = "FETCH_TESTS_FAILURE";

export const fetchTestsRequest = () => ({
  type: FETCH_TESTS_REQUEST,
});

export const fetchTestsSuccess = (tests) => ({
  type: FETCH_TESTS_SUCCESS,
  payload: tests,
});

export const fetchTestsFailure = (error) => ({
  type: FETCH_TESTS_FAILURE,
  payload: error,
});

export const fetchTests = () => {
  return (dispatch) => {
    dispatch(fetchTestsRequest());
    fetch("/api/tests/all")
      .then((response) => response.json())
      .then((data) => dispatch(fetchTestsSuccess(data)))
      .catch((error) => dispatch(fetchTestsFailure(error.message)));
  };
};
