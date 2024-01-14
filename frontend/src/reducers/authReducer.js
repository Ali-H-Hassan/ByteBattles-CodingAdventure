import {
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  LOGIN_REQUEST,
} from "../actions/actionTypes";

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  error: null,
  loading: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
        loading: false,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
        loading: false,
      };
    case LOGOUT:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export default authReducer;
