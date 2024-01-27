import {
  loginSuccess,
  profileRequestFailure,
  profileRequestUpdate,
} from "./authSlice";
import apiClient from "../../services/apiConfig";

export const login = (credentials, navigate) => async (dispatch) => {
  dispatch(profileRequestUpdate());
  try {
    const response = await apiClient.post(
      "http://localhost:3000/api/auth/login",
      credentials
    );
    const { user, token } = response.data;
    localStorage.setItem("token", token);
    dispatch(loginSuccess({ user, token }));
    if (user.userType === "company") {
      navigate("/company-dashboard");
    } else {
      navigate("/dashboard");
    }
  } catch (error) {
    const errorMessage = error.response ? error.response.data : "Login failed";
    dispatch(profileRequestFailure(errorMessage));
  }
};

export const registerUser = (userData, navigate) => async (dispatch) => {
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

export const registerRequest = () => ({
  type: "auth/registerRequest",
});

export const registerSuccess = (userData) => ({
  type: "auth/registerSuccess",
  payload: userData,
});

export const registerFailure = (error) => ({
  type: "auth/registerFailure",
  payload: error,
});
export const updateProfile = (userData) => async (dispatch) => {
  dispatch(profileUpdateRequest());
  try {
    const formData = new FormData();
    Object.entries(userData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const response = await apiClient.post("/api/profile/update", formData);
    dispatch(profileUpdateSuccess(response.data));
  } catch (error) {
    const errorMessage = error.response
      ? error.response.data
      : "Profile update failed";
    dispatch(profileUpdateFailure(errorMessage));
  }
};

export const profileUpdateRequest = () => ({
  type: "auth/profileUpdateRequest",
});

export const profileUpdateSuccess = (userData) => ({
  type: "auth/profileUpdateSuccess",
  payload: userData,
});

export const profileUpdateFailure = (error) => ({
  type: "auth/profileUpdateFailure",
  payload: error,
});
