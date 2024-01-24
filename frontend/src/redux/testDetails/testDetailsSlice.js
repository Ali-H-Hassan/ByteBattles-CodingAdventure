import { createSlice } from "@reduxjs/toolkit";

const initialTestDetailsState = {
  loading: false,
  test: null,
  error: null,
};

export const testDetailsSlice = createSlice({
  initialState: initialTestDetailsState,
  name: "testDetails",
  reducers: {
    fetchTestRequest: (state, action) => {
      return {
        ...state,
        loading: true,
        error: null,
      };
    },
    fetchTestSuccess: (state, action) => {
      return {
        ...state,
        loading: false,
        test: action.payload,
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

export const { fetchTestSuccess, fetchTestFailure, fetchTestRequest } =
  testDetailsSlice.actions;

export default testDetailsSlice.reducer;
