import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/apiConfig";

export const fetchTests = createAsyncThunk(
  "test/fetchTests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/api/tests/all?limit=2");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const fetchTestById = createAsyncThunk(
  "test/fetchTestById",
  async (testId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/api/tests/${testId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const submitTestAnswers = createAsyncThunk(
  "test/submitTestAnswers",
  async ({ testId, answers }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        `/api/tests/submit/${testId}`,
        answers
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const fetchCompanyTests = createAsyncThunk(
  "test/fetchCompanyTests",
  async (companyId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `/api/tests/company?companyId=${companyId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const createTest = createAsyncThunk(
  "test/createTest",
  async (testData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/api/tests/create", testData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);
