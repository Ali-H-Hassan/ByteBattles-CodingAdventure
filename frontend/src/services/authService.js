import apiClient from "./apiConfig";

export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post(
      "http://localhost:3000/api/auth/register",
      userData
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const loginUser = async (credentials) => {
  console.log("Logging in with credentials:", credentials);

  try {
    const response = await apiClient.post(
      "http://localhost:3000/api/auth/login",
      credentials
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
