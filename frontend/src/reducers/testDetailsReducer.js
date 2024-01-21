export const FETCH_TEST_BY_ID_REQUEST = "FETCH_TEST_BY_ID_REQUEST";
export const FETCH_TEST_BY_ID_SUCCESS = "FETCH_TEST_BY_ID_SUCCESS";
export const FETCH_TEST_BY_ID_FAILURE = "FETCH_TEST_BY_ID_FAILURE";

const initialTestDetailsState = {
  loading: false,
  test: null,
  error: null,
};

const testDetailsReducer = (state = initialTestDetailsState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_TEST_BY_ID_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case actionTypes.FETCH_TEST_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        test: action.payload,
      };
    case actionTypes.FETCH_TEST_BY_ID_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default testDetailsReducer;
