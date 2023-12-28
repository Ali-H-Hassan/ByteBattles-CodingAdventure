import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL; // Replace with your API base URL

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
