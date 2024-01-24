import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  loading: false,
  tests: [],
  error: null,
  currentTestId: null,
  companyTests: [],
};
export const testSlice = createSlice({
  initialState,
  name: "test",
  reducers: {
    fetchTestsRequest: (state, action) => {
      return {
        ...state,
        loading: true,
        error: null,
      };
    },
    fetchTestsSuccess: (state, action) => {
      return {
        ...state,
        loading: false,
        tests: action.payload,
      };
    },
    fetchTestsCompanySuccess: (state, action) => {
      return {
        ...state,
        companyTests: action.payload,
        loading: false,
      };
    },
    createTestRequest: (state, action) => {
      return {
        ...state,
        loading: true,
        error: null,
      };
    },
    createTestSuccess: (state, action) => {
      return {
        ...state,
        loading: false,
        tests: [...state.tests, action.payload],
      };
    },
    createTestFailure: (state, action) => {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    fetchTestFailure: (state, action) => {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
  },
});
export const {} = testSlice.reducer;
export default testSlice.reducer;
