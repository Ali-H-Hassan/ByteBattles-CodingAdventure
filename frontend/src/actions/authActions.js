import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  PROFILE_UPDATE_REQUEST,
  PROFILE_UPDATE_SUCCESS,
  PROFILE_UPDATE_FAILURE,
} from "./actionTypes";
import apiClient from "../services/apiConfig";

export const loginRequest = () => ({
  type: LOGIN_REQUEST,
});

export const loginSuccess = (userData) => ({
  type: LOGIN_SUCCESS,
  payload: userData,
});

export const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  payload: error,
});

export const login = (credentials) => async (dispatch, getState) => {
  dispatch(loginRequest());
  try {
    const response = await apiClient.post(
      "http://localhost:3000/api/auth/login",
      credentials
    );
    const { user, token } = response.data;
    localStorage.setItem("token", token);
    dispatch(loginSuccess({ user, token }));
    if (user.userType === "company") {
      navigate("/create-test");
    } else {
      navigate("/dashboard");
    }
  } catch (error) {
    const errorMessage = error.response ? error.response.data : "Login failed";
    dispatch(loginFailure(errorMessage));
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  return { type: LOGOUT };
};

export const registerRequest = () => ({
  type: REGISTER_REQUEST,
});

export const registerSuccess = (userData) => ({
  type: REGISTER_SUCCESS,
  payload: userData,
});

export const registerFailure = (error) => ({
  type: REGISTER_FAILURE,
  payload: error,
});

export const registerUser = (userData) => async (dispatch) => {
  dispatch(registerRequest());
  try {
    const response = await apiClient.post(
      "http://localhost:3000/api/auth/register",
      userData
    );
    const { user, token } = response.data;
    localStorage.setItem("token", token);
    dispatch(registerSuccess({ user, token }));
  } catch (error) {
    const errorMessage = error.response
      ? error.response.data
      : "Registration failed";
    dispatch(registerFailure(errorMessage));
  }
};
export const profileUpdateRequest = () => ({
  type: PROFILE_UPDATE_REQUEST,
});

export const profileUpdateSuccess = (userData) => ({
  type: PROFILE_UPDATE_SUCCESS,
  payload: userData,
});

export const profileUpdateFailure = (error) => ({
  type: PROFILE_UPDATE_FAILURE,
  payload: error,
});

export const updateProfile = (userData, authToken) => async (dispatch) => {
  dispatch(profileUpdateRequest());
  try {
    const response = await apiClient.post("/api/profile/update", userData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    dispatch(profileUpdateSuccess(response.data));
  } catch (error) {
    dispatch(profileUpdateFailure(error.response.data));
  }
};
