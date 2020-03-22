import {
  SET_ALL_EVENTS,
  SET_NOTICE,
  SET_HOME_IMAGES,
  GET_ERRORS,
  UPDATE_ISPROFILECREATED,
  SET_USERS
} from "./types";
import axios from "axios";

export const getAllEvents = () => dispatch => {
  axios
    .get("https://api-msi-event-manager.now.sh/event/all")
    .then(res => {
      dispatch({
        type: SET_ALL_EVENTS,
        payload: res.data
      });
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

export const registerProfile = (data, history) => dispatch => {
  axios
    .post("https://api-msi-event-manager.now.sh/profile/register", data)
    .then(res => {
      if (res.data) {
        dispatch(updateIsProfileCreate(true));
        history.push("/user/profile");
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

export const registerEvent = (data, history) => dispatch => {
  console.log(data);
  axios // https://api-msi-event-manager.now.sh/event/register
    .post("https://api-msi-event-manager.now.sh/event/register", data)
    .then(res => {
      if (res.data) {
        dispatch(getAllEvents());
        history.push("/dashboard");
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

export const getHomeImages = () => dispatch => {
  axios
    .get("https://api-msi-event-manager.now.sh/image/home")
    .then(res => {
      if (res.data) {
        dispatch({
          type: SET_HOME_IMAGES,
          payload: res.data
        });
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

export const getLatestNotice = () => dispatch => {
  axios("https://api-msi-event-manager.now.sh/notice/latest")
    .then(res => {
      if (res.data) {
        dispatch({
          type: SET_NOTICE,
          payload: res.data
        });
      }
    })
    .catch(err => {
      if (err.response) {
        dispatch({ type: GET_ERRORS, payload: err.response.data });
      } else {
        console.log(err);
      }
    });
};

export const updateIsProfileCreate = data => dispatch => {
  dispatch({
    type: UPDATE_ISPROFILECREATED,
    payload: data
  });
};

export const getAllUsers = () => dispatch => {
  axios
    .get("https://api-msi-event-manager.now.sh/user/all")
    .then(res => {
      dispatch({
        type: SET_USERS,
        payload: res.data
      });
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
