// import ProductDataService from "../firebase-service/product-service";
import firebase from "../firebase-service/firebase";
import { stopSubmit } from "redux-form";

const SET_USER_DATA = "SET_USER_DATA";

let initialState = {
  userId: null,
  email: null,
  isAuth: false,
};
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_DATA:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return { ...state };
  }
};

export const setAuthUserData = (userId, email, isAuth) => ({
  type: SET_USER_DATA,
  payload: { userId, email, isAuth },
});

export const checkIfLogin = () => async (dispatch) => {
  return new Promise((resolve) => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        resolve(dispatch(setAuthUserData(user.uid, user.email, true)));
        return true;
      } else {
        // No user is signed in.
        console.log("no login");
        resolve(dispatch(setAuthUserData(null, null, false)));
      }
    });
  });
};

export const signup = (email, password) => async (dispatch) => {
  try {
    await firebase.auth().createUserWithEmailAndPassword(email, password);
  } catch (err) {
    console.log(err.message);
    dispatch(stopSubmit("signup", { _error: err.message }));
  }
};

export const signin = (email, password) => async (dispatch) => {
  try {
    let response = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    dispatch(setAuthUserData(response.user.uid, email, true));
  } catch (err) {
    console.log(err.message);
    dispatch(stopSubmit("signin", { _error: err.message }));
  }
};

export const signout = () => async (dispatch) => {
  try {
    await firebase.auth().signOut();
    dispatch(setAuthUserData(null, null, false));
  } catch (err) {
    console.log(err.message);
    dispatch(stopSubmit("sigput", { _error: err.message }));
  }
};

export default authReducer;
