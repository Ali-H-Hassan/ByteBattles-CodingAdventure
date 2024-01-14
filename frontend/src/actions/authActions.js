import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
} from "./actionTypes";
import apiClient from "../services/apiConfig"; // Adjust this path to where your apiClient is defined

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

// Thunk action creator for performing the login
export const login = (credentials) => async (dispatch) => {
  dispatch(loginRequest());
  try {
    const response = await apiClient.post(
      "http://localhost:3000/api/auth/login",
      credentials
    );
    const { user, token } = response.data;
    localStorage.setItem("token", token); // Store the token
    dispatch(loginSuccess({ user, token }));
  } catch (error) {
    // Dispatch error message
    const errorMessage = error.response ? error.response.data : "Login failed";
    dispatch(loginFailure(errorMessage));
  }
};

// Action creator for logout
export const logout = () => {
  localStorage.removeItem("token"); // Clear the token from storage
  return { type: LOGOUT };
};

// Optionally, if you have a register user action
export const registerUser = (userData) => async (dispatch) => {
  try {
    const response = await apiClient.post(
      "http://localhost:3000/api/auth/register",
      userData
    );
    // Handle registration success if needed
  } catch (error) {
    // Handle registration error if needed
  }
};
