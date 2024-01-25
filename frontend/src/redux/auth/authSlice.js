import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/apiConfig";

export const login = createAsyncThunk(
  "auth/login",
  async ({ credentials, navigate }, { dispatch }) => {
    try {
      const response = await apiClient.post("/api/auth/login", credentials);
      const { user, token } = response.data;
      localStorage.setItem("token", token);
      dispatch(loginSuccess({ user, token }));
      navigate(
        user.userType === "company" ? "/company-dashboard" : "/dashboard"
      );
      return response.data;
    } catch (error) {
      return Promise.reject(
        error.response ? error.response.data : "Login failed"
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ userData, navigate }, { dispatch }) => {
    try {
      const response = await apiClient.post("/api/auth/register", userData);
      const { user, token } = response.data;
      localStorage.setItem("token", token);
      dispatch(loginSuccess({ user, token }));
      navigate("/dashboard");
      return response.data;
    } catch (error) {
      return Promise.reject(
        error.response ? error.response.data : "Registration failed"
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (formData, { getState }) => {
    const { auth } = getState();
    try {
      const response = await apiClient.post("/api/profile/update", formData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return response.data;
    } catch (error) {
      return Promise.reject(
        error.response ? error.response.data : error.message
      );
    }
  }
);

const initialState = {
  isAuthenticated: false,
  user: null,
  userType: null,
  token: null,
  error: null,
  loading: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.userType = action.payload.user.userType;
      state.token = action.payload.token;
      state.error = null;
      state.loading = false;
    },
    profileRequestFailure: (state, action) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.token = action.payload.token || state.token;
        state.error = null;
        state.loading = false;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { loginSuccess, profileRequestFailure } = authSlice.actions;

export default authSlice.reducer;
