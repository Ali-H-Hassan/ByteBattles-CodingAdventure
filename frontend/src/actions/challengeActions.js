export const CREATE_CHALLENGE_REQUEST = "CREATE_CHALLENGE_REQUEST";
export const CREATE_CHALLENGE_SUCCESS = "CREATE_CHALLENGE_SUCCESS";
export const CREATE_CHALLENGE_FAILURE = "CREATE_CHALLENGE_FAILURE";

import axios from "axios";

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
      "/api/company/create-challenge",
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
