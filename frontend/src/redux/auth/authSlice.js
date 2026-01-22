import { createSlice } from "@reduxjs/toolkit";

// Initialize state with token from localStorage if available
const getInitialState = () => {
  const token = localStorage.getItem("token");
  return {
    isAuthenticated: false,
    user: null,
    userType: null,
    token: token,
    error: null,
    loading: false,
  };
};

const initialState = getInitialState();
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
    registerRequest: (state) => {
      return { ...state, loading: true, error: null };
    },
    registerSuccess: (state, action) => {
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
    registerFailure: (state, action) => {
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
      localStorage.removeItem("token");
      return {
        ...initialState,
        token: null,
        userType: null,
      };
    },
    restoreSession: (state, action) => {
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        userType: action.payload.user?.userType || state.userType,
        token: action.payload.token || state.token,
        error: null,
        loading: false,
      };
    },
    clearSession: (state, action) => {
      localStorage.removeItem("token");
      return {
        ...initialState,
        token: null,
      };
    },
    setLoading: (state, action) => {
      return {
        ...state,
        loading: action.payload,
      };
    },
    profileUpdateRequest: (state) => {
      return { ...state, loading: true, error: null };
    },
    profileUpdateSuccess: (state, action) => {
      // Backend returns user object directly, not wrapped in { user, token }
      const updatedUser = action.payload.user || action.payload;
      return {
        ...state,
        user: updatedUser,
        userType: updatedUser.userType || state.userType,
        error: null,
        loading: false,
      };
    },
    profileUpdateFailure: (state, action) => {
      return {
        ...state,
        error: action.payload,
        loading: false,
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
  registerRequest,
  registerSuccess,
  registerFailure,
  profileUpdateRequest,
  profileUpdateSuccess,
  profileUpdateFailure,
  restoreSession,
  clearSession,
  setLoading,
} = authSlice.actions;
export default authSlice.reducer;
