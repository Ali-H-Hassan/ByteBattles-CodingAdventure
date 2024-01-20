import * as actionTypes from "../actions/actionTypes";

const initialState = {
  loading: false,
  tests: [],
  error: "",
};

const testReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_TESTS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.FETCH_TESTS_SUCCESS:
      return {
        loading: false,
        tests: action.payload,
        error: "",
      };
    case actionTypes.FETCH_TESTS_FAILURE:
      return {
        loading: false,
        tests: [],
        error: action.payload,
      };
    default:
      return state;
  }
};

export default testReducer;
