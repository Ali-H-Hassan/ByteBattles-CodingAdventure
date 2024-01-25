import { createSlice } from "@reduxjs/toolkit";
import {
  fetchTests,
  fetchTestById,
  submitTestAnswers,
  fetchCompanyTests,
  createTest,
} from "./testActions";

const initialState = {
  loading: false,
  tests: [],
  error: null,
  currentTestId: null,
  companyTests: [],
};

export const testSlice = createSlice({
  name: "test",
  initialState,
  reducers: {
    setCurrentTestId: (state, action) => {
      state.currentTestId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTests.fulfilled, (state, action) => {
        state.loading = false;
        state.tests = action.payload;
      })
      .addCase(fetchTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTest.fulfilled, (state, action) => {
        state.loading = false;
        state.tests = [...state.tests, action.payload];
      })
      .addCase(createTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentTestId } = testSlice.actions;
export default testSlice.reducer;
