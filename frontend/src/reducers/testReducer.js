import {
  FETCH_TESTS_REQUEST,
  FETCH_TESTS_SUCCESS,
  FETCH_TESTS_FAILURE,
} from "../actions/testActions";

const initialState = {
  loading: false,
  tests: [],
  error: "",
};

const testReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TESTS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_TESTS_SUCCESS:
      return {
        loading: false,
        tests: action.payload,
        error: "",
      };
    case FETCH_TESTS_FAILURE:
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
