import { createSlice } from "@reduxjs/toolkit";
import {
  updateProfile,
  login,
  performLogout,
  registerUser,
} from "./authActions";
const initialState = {
  isAuthenticated: false,
  user: null,
  userType: null,
  token: null,
  error: null,
  loading: false,
};
export const authSlice = createSlice({
  initialState,
  name: "auth",
  reducers: {
    profileRequestUpdate: (state, action) => {
      return { ...state, loading: true, error: null };
    },
    loginSuccess: (state, action) => {
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        userType: action.payload.user.userType,
        token: action.payload.token || state.token,
        error: null,
        loading: false,
      };
    },
    profileRequestSuccess: (state, action) => {
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token || state.token,
        error: null,
        loading: false,
      };
    },
    profileRequestFailure: (state, action) => {
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
        loading: false,
      };
    },
    logout: (state, action) => {
      return {
        ...initialState,
        userType: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        if (action.payload.user) {
          // Make sure the payload includes the user object
          state.loading = false;
          state.user = action.payload.user;
          state.isAuthenticated = true;
          state.token = action.payload.token || state.token;
          state.error = null;
        } else {
          // Handle the case where user is not part of the payload
          console.error("User data is not present in the payload");
          state.error = "User data is not present in the payload";
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const {
  loginSuccess,
  logout,
  profileRequestFailure,
  profileRequestSuccess,
  profileRequestUpdate,
} = authSlice.actions;
export default authSlice.reducer;
