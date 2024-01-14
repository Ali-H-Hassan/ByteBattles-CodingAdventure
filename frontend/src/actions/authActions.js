import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
} from "./actionTypes";
import axios from "axios"; // Make sure axios is installed or use your preferred method for API calls

// Action creator for initiating a login request
export const loginRequest = () => ({
  type: LOGIN_REQUEST,
});

// Action creator for successful login
export const loginSuccess = (userData) => ({
  type: LOGIN_SUCCESS,
  payload: userData,
});

// Action creator for failed login
export const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  payload: error,
});

// Action creator for logout
export const logout = () => ({
  type: LOGOUT,
});

// Thunk action creator for performing the login
export const login = (credentials) => async (dispatch) => {
  dispatch(loginRequest());
  try {
    // Replace '/api/login' with your actual login endpoint
    const response = await axios.post("/api/login", credentials);
    const { user, token } = response.data;
    // Store the token in local storage or handle it as you see fit
    localStorage.setItem("token", token);
    dispatch(loginSuccess({ user, token }));
  } catch (error) {
    dispatch(loginFailure(error.response.data)); // Assuming error response has a data property
  }
};

// Thunk action creator for performing the logout
export const performLogout = () => (dispatch) => {
  // Perform any necessary cleanup, like clearing local storage
  localStorage.removeItem("token");
  dispatch(logout());
  // Optionally, redirect the user or perform other logic post-logout
};
