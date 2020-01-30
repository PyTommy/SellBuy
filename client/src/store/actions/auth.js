import axios from '../../axios';
import {
    LOAD_USER_START,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAIL,

    REGISTER,
    LOGIN,
    LOGOUT,

    // UPDATE
    UPDATE_AVATAR,
    UPDATE_PROFILE,
    UPDATE_EMAIL,
} from './actionType';
import { setAlert } from './alert';
import { clearMessages, countUnseenMessages } from './message';
import { clearNotifications, countUnseenNotifications } from './notification';
import { clearAllMyList } from './mylist';


// Load user data on store
export const loadUser = () => async dispatch => {
    if (!localStorage.token) return null;

    // Set auth header on default http request
    axios.setAuthToken(localStorage.token);

    dispatch({ type: LOAD_USER_START });

    try {
        const res = await axios.get('/api/user');

        dispatch(setAlert(`Welcome, ${res.data.name}`, "success"));
        dispatch({
            type: LOAD_USER_SUCCESS,
            payload: res.data
        });

        // Check how many notifications and messages are.
        dispatch(countUnseenMessages());
        dispatch(countUnseenNotifications());
    } catch (err) {
        dispatch(setAlert(err.response.data.message, "danger"));
        dispatch({ type: LOAD_USER_FAIL });
    }

};

export const login = ({ email, password }, failCB = () => { }) => async dispatch => {
    try {
        const res = await axios.post('/api/user/login', { email, password });

        dispatch({
            type: LOGIN,
            payload: res.data
        });
        dispatch(loadUser(localStorage.token));
    } catch (err) {
        failCB();
        dispatch(setAlert(err.response.data.message, "danger"));
    }
};

// REGISTER
export const register = (
    { name, email, password },
    failCB = () => { }
) => async dispatch => {
    try {
        const res = await axios.post('/api/user/signup', { name, email, password });

        dispatch({
            type: REGISTER,
            payload: res.data
        });
        dispatch(loadUser(localStorage.token));
    } catch (err) {
        failCB();
        dispatch(setAlert(err.response.data.message, "danger"));
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
        headers: { 'Content-Type': 'multipart/form-data' }
    }

    // Create form data
    const formData = new FormData();
    formData.append('avatar', avatar);

    try {
        const res = await axios.put('/api/user/avatar', formData, config);

        dispatch(setAlert(`Uploaded profile image`, "success"));
        dispatch({
            type: UPDATE_AVATAR,
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
            type: UPDATE_PROFILE,
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
            type: UPDATE_EMAIL,
            payload: res.data
        });
        successCB();
    } catch (err) {
        dispatch(setAlert(err.response.data.message, "danger"));
        failCB();
    }
}

