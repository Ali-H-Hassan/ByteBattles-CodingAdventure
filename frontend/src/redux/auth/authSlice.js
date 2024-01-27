import { createSlice } from "@reduxjs/toolkit";
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
});
export const {
  loginSuccess,
  logout,
  profileRequestFailure,
  profileRequestSuccess,
  profileRequestUpdate,
} = authSlice.actions;
export default authSlice.reducer;
