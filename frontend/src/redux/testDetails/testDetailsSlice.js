import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/apiConfig";

export const fetchTestById = createAsyncThunk(
  "testDetails/fetchTestById",
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

const initialTestDetailsState = {
  loading: false,
  test: null,
  error: null,
};

export const testDetailsSlice = createSlice({
  name: "testDetails",
  initialState: initialTestDetailsState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTestById.fulfilled, (state, action) => {
        state.loading = false;
        state.test = action.payload;
      })
      .addCase(fetchTestById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default testDetailsSlice.reducer;
