import {
  fetchTestFailure,
  fetchTestsRequest,
  fetchTestsSuccess,
} from "./testSlice";
import apiClient from "../../services/apiConfig";
export const fetchTests = async (dispatch) => {
  dispatch(fetchTestsRequest());
  try {
    const response = await apiClient.get("/api/tests/all?limit=2");
    dispatch(fetchTestsSuccess(response.data));
  } catch (error) {
    dispatch(fetchTestFailure(error.message));
  }
};
