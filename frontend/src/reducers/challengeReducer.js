import {
  CREATE_CHALLENGE_REQUEST,
  CREATE_CHALLENGE_SUCCESS,
  CREATE_CHALLENGE_FAILURE,
  FETCH_CHALLENGE_REQUEST,
  FETCH_CHALLENGE_SUCCESS,
  FETCH_CHALLENGE_FAILURE,
} from "../actions/actionTypes";

const initialState = {
  creating: false,
  challenge: null,
  error: null,
};

const challengeReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_CHALLENGE_REQUEST:
      return {
        ...state,
        creating: true,
      };
    case CREATE_CHALLENGE_SUCCESS:
      return {
        ...state,
        creating: false,
        challenge: action.payload,
        error: null,
      };
    case CREATE_CHALLENGE_FAILURE:
      return {
        ...state,
        creating: false,
        error: action.payload,
      };
    case FETCH_CHALLENGE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_CHALLENGE_SUCCESS:
      return {
        ...state,
        loading: false,
        challenge: action.payload,
        error: null,
      };
    case FETCH_CHALLENGE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default challengeReducer;
