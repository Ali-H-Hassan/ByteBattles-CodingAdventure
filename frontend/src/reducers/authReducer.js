// import {
//   LOGIN_REQUEST,
//   LOGIN_SUCCESS,
//   LOGIN_FAILURE,
//   LOGOUT,
//   REGISTER_REQUEST,
//   REGISTER_SUCCESS,
//   REGISTER_FAILURE,
//   PROFILE_UPDATE_REQUEST,
//   PROFILE_UPDATE_SUCCESS,
//   PROFILE_UPDATE_FAILURE,
// } from "../actions/actionTypes";

// const initialState = {
//   isAuthenticated: false,
//   user: null,
//   userType: null,
//   token: null,
//   error: null,
//   loading: false,
// };

// const authReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case LOGIN_REQUEST:
//     case REGISTER_REQUEST:
//     case PROFILE_UPDATE_REQUEST:
//       return {
//         ...state,
//         loading: true,
//         error: null,
//       };
//     case LOGIN_SUCCESS:
//       return {
//         ...state,
//         isAuthenticated: true,
//         user: action.payload.user,
//         userType: action.payload.user.userType,
//         token: action.payload.token || state.token,
//         error: null,
//         loading: false,
//       };
//     case REGISTER_SUCCESS:
//     case PROFILE_UPDATE_SUCCESS:
//       return {
//         ...state,
//         isAuthenticated: true,
//         user: action.payload.user,
//         token: action.payload.token || state.token,
//         error: null,
//         loading: false,
//       };
//     case LOGIN_FAILURE:
//     case REGISTER_FAILURE:
//     case PROFILE_UPDATE_FAILURE:
//       return {
//         ...state,
//         isAuthenticated: false,
//         user: null,
//         token: null,
//         error: action.payload,
//         loading: false,
//       };
//     case LOGOUT:
//       return {
//         ...initialState,
//         userType: null,
//       };
//     default:
//       return state;
//   }
// };

// export default authReducer;
