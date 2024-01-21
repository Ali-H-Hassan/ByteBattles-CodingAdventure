import * as actionTypes from "../actions/actionTypes";

const initialState = {
  loading: false,
  tests: [],
  error: null,
  currentTestId: null,
};

const testReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_TESTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case actionTypes.FETCH_TESTS_SUCCESS:
      return {
        ...state,
        loading: false,
        tests: action.payload,
      };
    case actionTypes.FETCH_TESTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default testReducer;
