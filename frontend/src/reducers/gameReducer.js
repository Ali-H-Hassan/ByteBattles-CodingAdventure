import { SUBMIT_SCORE } from "../actions/actionTypes";

const initialState = {
  highScore: 0,
};

export default function gameReducer(state = initialState, action) {
  switch (action.type) {
    case SUBMIT_SCORE:
      return {
        ...state,
        highScore: action.payload,
      };
    default:
      return state;
  }
}
