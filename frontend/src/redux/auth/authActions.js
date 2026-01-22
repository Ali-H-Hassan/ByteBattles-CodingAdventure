import {
  loginSuccess,
  profileRequestFailure,
  profileRequestUpdate,
  profileUpdateRequest,
  profileUpdateSuccess,
  profileUpdateFailure,
  restoreSession,
  clearSession,
  setLoading,
} from "./authSlice";
import apiClient from "../../services/apiConfig";

export const login = (credentials, navigate) => async (dispatch) => {
  dispatch(profileRequestUpdate());
  try {
    const response = await apiClient.post(
      "/api/auth/login",
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
    let errorMessage = "Login failed";
    if (error.response?.data) {
      // Handle different error response formats
      if (typeof error.response.data === "string") {
        errorMessage = error.response.data;
      } else if (error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.data.error) {
        errorMessage = error.response.data.error;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    dispatch(profileRequestFailure(errorMessage));
  }
};

export const registerUser = (userData, navigate) => async (dispatch) => {
  dispatch(registerRequest());
  try {
    const response = await apiClient.post(
      "/api/auth/register",
      userData
    );
    const { user, token } = response.data;
    localStorage.setItem("token", token);

    await dispatch(registerSuccess({ user, token }));
    navigate("/dashboard");
  } catch (error) {
    let errorMessage = "Registration failed";
    if (error.response?.data) {
      // Handle different error response formats
      if (typeof error.response.data === "string") {
        errorMessage = error.response.data;
      } else if (error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.data.error) {
        errorMessage = error.response.data.error;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
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
    
    // Debug: Log what we're building
    console.log("Building FormData from:", userData);
    
    Object.entries(userData).forEach(([key, value]) => {
      // Include all values except null/undefined
      // Include empty strings to allow clearing fields
      // Exclude profilePicture if it's not a File object
      if (value !== null && value !== undefined) {
        if (key === 'profilePicture') {
          // Only append if it's a File object
          if (value instanceof File) {
            formData.append(key, value);
            console.log(`Appended file: ${key}`);
          }
        } else {
          // Append all other values (including empty strings)
          formData.append(key, value);
          console.log(`Appended ${key}:`, value);
        }
      }
    });

    // Debug: Log FormData contents
    console.log("FormData entries:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + (pair[1] instanceof File ? `[File: ${pair[1].name}]` : pair[1]));
    }

    const response = await apiClient.post("/api/profile/update", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log("API Response:", response.data);

    // Backend returns user object directly
    dispatch(profileUpdateSuccess({ user: response.data }));
    
    // Show success message
    return { success: true, user: response.data };
  } catch (error) {
    console.error("API request failed:", error);
    let errorMessage = "Profile update failed";
    
    if (error.response) {
      if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      } else if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      } else if (error.response.status === 405) {
        errorMessage = "Update method not allowed. Please contact support.";
      } else if (error.response.status === 404) {
        errorMessage = "Profile not found.";
      } else if (error.response.status === 401) {
        errorMessage = "Unauthorized. Please log in again.";
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    dispatch(profileUpdateFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};

/**
 * Restore user session from token stored in localStorage
 * This is called on app initialization to restore authentication state
 */
export const restoreUserSession = () => async (dispatch) => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    // No token, user is not authenticated
    dispatch(clearSession());
    dispatch(setLoading(false));
    return;
  }

  // Set loading state while checking token
  dispatch(setLoading(true));

  try {
    // Fetch current user profile to verify token and get user data
    const response = await apiClient.get("/api/profile");
    const user = response.data;
    
    // Token is valid, restore session
    dispatch(restoreSession({ user, token }));
  } catch (error) {
    // Token is invalid or expired, clear it
    console.error("Failed to restore session:", error);
    dispatch(clearSession());
    
    // If it's a 401, the token is invalid/expired
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }
  } finally {
    dispatch(setLoading(false));
  }
};
