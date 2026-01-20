/**
 * ============================================================================
 * API Configuration
 * ============================================================================
 * This file configures the API client for the ByteBattles frontend.
 * 
 * Backend Options:
 * - Node.js/Express (Legacy): http://localhost:3000
 * - .NET 8 (New): http://localhost:5057
 * 
 * Set REACT_APP_API_URL in your .env file to switch between backends:
 * - For Node.js: REACT_APP_API_URL=http://localhost:3000
 * - For .NET: REACT_APP_API_URL=http://localhost:5057
 * ============================================================================
 */

import axios from "axios";

// Default to .NET backend if not specified
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5057";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API Endpoints (compatible with both Node.js and .NET backends)
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
  },
  USERS: {
    BASE: "/users",
    BY_ID: (id) => `/users/${id}`,
    LOGIN: "/users/login",
    REGISTER: "/users/register",
    CREATE_COMPANY: "/users/admin/create-company",
  },
  TESTS: {
    ALL: "/api/tests/all",
    BY_ID: (id) => `/api/tests/${id}`,
    CREATE: "/api/tests/create",
    COMPANY: "/api/tests/company",
  },
  GAMES: {
    COURSES: "/api/games/courses",
    SUBMIT_SCORE: "/api/games/submit-score",
  },
  CHALLENGES: {
    ALL: "/api/challenges",
    BY_ID: (id) => `/api/challenges/${id}`,
    RANDOM: "/api/challenges/random",
  },
  BATTLE: {
    RUN: "/api/battle/run",
  },
  PROFILE: {
    BASE: "/api/profile",
    BY_ID: (id) => `/api/profile/${id}`,
    LEADERBOARD: "/api/profile/leaderboard",
  },
};

export default apiClient;
