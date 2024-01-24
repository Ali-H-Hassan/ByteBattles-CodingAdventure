import {
  loginSuccess,
  profileRequestFailure,
  profileRequestUpdate,
} from "./authSlice";
import apiClient from "../../services/apiConfig";
export const login = async (credentials, navigate, dispatch) => {
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
export const registerUser = async (credentials, navigate, dispatch) => {
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
