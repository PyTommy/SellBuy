import axios from '../../axios';
import {
    // LOAD_USER
    LOAD_USER_START,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAIL,

    // REGISTER
    REGISTER_START,
    REGISTER_SUCCESS,
    REGISTER_FAIL,

    // LOGIN
    LOGIN_START,
    LOGIN_SUCCESS,
    LOGIN_FAIL,

    // LOGOUT
    LOGOUT,

    // AVATAR
    UPDATE_AVATAR_SUCCESS,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_EMAIL_SUCCESS,
} from './actionType';
import { setAlert } from './alert';
import { clearMessages, countUnseenMessages } from './message';
import { clearNotifications, countUnseenNotifications } from './notification';
import { clearAllMyList } from './mylist';

export const loadUser = () => async dispatch => {
    if (!localStorage.token) {
        dispatch({ type: LOAD_USER_FAIL });
        return null;
    }

    axios.setAuthToken(localStorage.token);

    dispatch({
        type: LOAD_USER_START
    });

    try {
        const res = await axios.get('/api/user');

        dispatch(setAlert(`Welcome, ${res.data.name}`, "success"));
        dispatch({
            type: LOAD_USER_SUCCESS,
            payload: res.data
        });
        dispatch(countUnseenMessages());
        dispatch(countUnseenNotifications());
    } catch (err) {
        dispatch(setAlert(err.response.data.message, "danger"));
        dispatch({ type: LOAD_USER_FAIL });
    }

};

export const login = ({ email, password }) => async dispatch => {
    dispatch({
        type: LOGIN_START
    });

    try {
        const res = await axios.post('/api/user/login', { email, password });

        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });
        dispatch(loadUser(localStorage.token));
    } catch (err) {
        dispatch(setAlert(err.response.data.message, "danger"));
        dispatch({ type: LOGIN_FAIL });
    }
};

// REGISTER
export const register = ({ name, email, password }) => async dispatch => {
    dispatch({
        type: REGISTER_START
    });

    try {
        const res = await axios.post('/api/user/signup', { name, email, password });

        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        });
        dispatch(loadUser(localStorage.token));
    } catch (err) {
        dispatch(setAlert(err.response.data.message, "danger"));
        dispatch({ type: REGISTER_FAIL });
    }
};

export const logout = () => dispatch => {
    dispatch({ type: LOGOUT });
    dispatch(clearMessages());
    dispatch(clearNotifications());
    dispatch(clearAllMyList());

};

export const updateAvatar = (avatar) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }

    const formData = new FormData();
    formData.append('avatar', avatar);

    try {
        const res = await axios.put('/api/user/avatar', formData, config);

        dispatch(setAlert(`Uploaded profile image`, "success"));
        dispatch({
            type: UPDATE_AVATAR_SUCCESS,
            payload: res.data
        });
    } catch (err) {
        dispatch(setAlert(err.response.data.message, "danger"));
    }
};

export const updateProfile = (obj) => async dispatch => {
    try {
        const res = await axios.put('/api/user/profile', obj);

        dispatch(setAlert(`Updated Profile`, "success"));
        dispatch({
            type: UPDATE_PROFILE_SUCCESS,
            payload: res.data
        });
    } catch (err) {
        dispatch(setAlert(err.response.data.message, "danger"));
    }
};

export const updateEmail = (obj, successCB = () => { }, failCB = () => { }) => async dispatch => {
    try {
        const res = await axios.put('/api/user/email', obj);
        dispatch(setAlert(`Updated Email`, "success"));
        dispatch({
            type: UPDATE_EMAIL_SUCCESS,
            payload: res.data
        });
        successCB();
    } catch (err) {
        dispatch(setAlert(err.response.data.message, "danger"));
        failCB();
    }
}

