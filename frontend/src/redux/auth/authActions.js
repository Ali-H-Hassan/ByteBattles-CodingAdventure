import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/apiConfig";
import {
  loginSuccess,
  logout,
  profileRequestFailure,
  profileRequestSuccess,
  profileRequestUpdate,
} from "./authSlice";

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (formData, { getState, rejectWithValue }) => {
    const { auth } = getState();
    try {
      const response = await apiClient.post("/api/profile/update", formData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ credentials, navigate }, { dispatch }) => {
    try {
      const response = await apiClient.post(
        "http://localhost:3000/api/auth/login",
        credentials
      );
      const { user, token } = response.data;
      localStorage.setItem("token", token);
      dispatch(loginSuccess({ user, token }));
      navigate(
        user.userType === "company" ? "/company-dashboard" : "/dashboard"
      );
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Login failed";
      dispatch(profileRequestFailure(errorMessage));
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ userData, navigate }, { dispatch }) => {
    try {
      const response = await apiClient.post(
        "http://localhost:3000/api/auth/register",
        userData
      );
      const { user, token } = response.data;
      localStorage.setItem("token", token);
      dispatch(loginSuccess({ user, token }));
      navigate("/dashboard");
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Registration failed";
      dispatch(profileRequestFailure(errorMessage));
    }
  }
);

export const performLogout = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    localStorage.removeItem("token");
    dispatch(logout());
  }
);
