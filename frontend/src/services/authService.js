import apiClient from "./apiConfig";

export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post("/register", userData);
    return response.data; // Handle the response data in the component
  } catch (error) {
    throw error.response.data; // Handle error in the component
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
