import apiClient from "./apiConfig";

export const registerUser = async (userData) => {
  try {
    // Update the URL to include the correct server port (3000)
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
  try {
    const response = await apiClient.post("/login", credentials);
    return response.data; // Handle the response data in the component
  } catch (error) {
    throw error.response.data; // Handle error in the component
  }
};
