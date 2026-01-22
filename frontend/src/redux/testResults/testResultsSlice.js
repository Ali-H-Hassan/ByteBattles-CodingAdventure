import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  results: [],
  loading: false,
  error: null,
};

const testResultsSlice = createSlice({
  name: "testResults",
  initialState,
  reducers: {
    fetchResultsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchResultsSuccess: (state, action) => {
      state.loading = false;
      state.results = action.payload;
      state.error = null;
    },
    fetchResultsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    submitTestRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    submitTestSuccess: (state, action) => {
      state.loading = false;
      state.results = [action.payload, ...state.results];
      state.error = null;
    },
    submitTestFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchResultsRequest,
  fetchResultsSuccess,
  fetchResultsFailure,
  submitTestRequest,
  submitTestSuccess,
  submitTestFailure,
} = testResultsSlice.actions;

export default testResultsSlice.reducer;

