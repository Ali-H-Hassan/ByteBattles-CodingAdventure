import { FETCH_COURSES } from "../actions/actionTypes";

const initialState = {
  courses: [],
};

const gameReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_COURSES:
      return {
        ...state,
        courses: action.payload,
      };
    default:
      return state;
  }
};

export default gameReducer;
