import {
  CLEAR_DATA,
  SET_CURRENT_USER,
  GET_ERRORS,
  CLEAR_ERRORS,
  AUTHENTICATE
} from "./types";
import axios from "axios";

import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

var config = {
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json"
  }
};

export const registerUser = (userData, history) => dispatch => {
  axios
    .post(
      "https://api-msi-event-manager.now.sh/user/register",
      userData,
      config
    )
    .then(res => {
      dispatch({
        type: CLEAR_ERRORS,
        payload: {}
      });
      history.push("/login");
    })
    .catch(err => {
      if (err.response) {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        });
      } else {
        console.log(err);
      }
    });
};

//Login - get login token

export const loginUser = (userData, history) => dispatch => {
  axios
    .post("https://api-msi-event-manager.now.sh/user/login", userData, config)
    .then(res => {
      const { token } = res.data;
      //saving token in local Storage
      localStorage.setItem("jwtToken", token);
      //setting token to auth header
      setAuthToken(token);
      //decoding token to get user data
      const decoded = jwt_decode(token);
      dispatch(setCurrentUser(decoded));
      dispatch({
        type: CLEAR_ERRORS,
        payload: {}
      });
      if (!decoded.isProfileCreated) {
        history.push("/user/profile");
      } else {
        history.push("/");
      }
    })
    .catch(err => {
      if (err.response) {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        });
      } else {
        console.log(err);
      }
    });
};

export const setCurrentUser = decoded => dispatch => {
  dispatch({
    type: SET_CURRENT_USER,
    payload: decoded
  });
};

export const logoutUser = () => dispatch => {
  // Remove token from localStorage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
  dispatch({
    type: CLEAR_DATA,
    payload: null
  });
  window.location = "/";
};
