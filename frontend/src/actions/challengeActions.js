import axios from "axios";
import {
  CREATE_CHALLENGE_REQUEST,
  CREATE_CHALLENGE_SUCCESS,
  CREATE_CHALLENGE_FAILURE,
} from "./actionTypes";

const createChallengeRequest = () => ({
  type: CREATE_CHALLENGE_REQUEST,
});

const createChallengeSuccess = (challenge) => ({
  type: CREATE_CHALLENGE_SUCCESS,
  payload: challenge,
});

const createChallengeFailure = (error) => ({
  type: CREATE_CHALLENGE_FAILURE,
  payload: error,
});

export const createChallenge = (challengeData, token) => async (dispatch) => {
  dispatch(createChallengeRequest());
  try {
    const response = await axios.post(
      "http://localhost:3000/api/company/create-challenge",
      challengeData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch(createChallengeSuccess(response.data));
  } catch (error) {
    dispatch(createChallengeFailure(error.response.data));
  }
};
