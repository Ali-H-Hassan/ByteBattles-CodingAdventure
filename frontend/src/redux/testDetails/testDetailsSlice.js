import { createSlice } from "@reduxjs/toolkit";
import testDetailsReducer from "../../reducers/testDetailsReducer";
const initialTestDetailsState = {
  loading: false,
  test: null,
  error: null,
};
export const authSlice = createSlice({
  initialState,
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
export const {} = testDetailsReducer.actions;
export default testDetailsReducer.reducer;
