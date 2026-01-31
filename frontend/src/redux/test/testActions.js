import {
  fetchTestsRequest,
  fetchTestsSuccess,
  fetchTestsCompanySuccess,
  createTestRequest,
  createTestSuccess,
  createTestFailure,
  fetchTestFailure,
  deleteTestSuccess,
} from "./testSlice";
import apiClient from "../../services/apiConfig";

export const fetchTests = () => async (dispatch) => {
  dispatch(fetchTestsRequest());
  try {
    const response = await apiClient.get("/api/tests/all");
    dispatch(fetchTestsSuccess(response.data));
  } catch (error) {
    dispatch(fetchTestFailure(error.message));
  }
};

export const fetchCompanyTests = (companyId) => async (dispatch) => {
  dispatch(fetchTestsRequest());
  try {
    const response = await apiClient.get(
      `/api/tests/company?companyId=${companyId}`
    );
    dispatch(fetchTestsCompanySuccess(response.data));
  } catch (error) {
    dispatch(fetchTestFailure(error.message));
  }
};

export const createTest = (testData) => async (dispatch) => {
  dispatch(createTestRequest());
  try {
    const response = await apiClient.post("/api/tests/create", testData);
    dispatch(createTestSuccess(response.data));
  } catch (error) {
    dispatch(createTestFailure(error.message));
  }
};

export const deleteTest = (testId) => async (dispatch) => {
  try {
    await apiClient.delete(`/api/tests/${testId}`);
    // Remove the test from the company tests list
    dispatch(deleteTestSuccess(testId));
    return { success: true };
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || "Failed to delete test");
  }
};
