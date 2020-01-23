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
    SET_AVATAR_START,
    SET_AVATAR_SUCCESS,
    SET_AVATAR_FAIL,
} from './actionType';
import { setAlert } from './alert';
import { clearMessages } from './message';

export const loadUser = () => async dispatch => {
    if (localStorage.token) {
        axios.setAuthToken(localStorage.token);
    } else {
        dispatch({
            type: LOAD_USER_FAIL
        });
        return null;
    }

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
    } catch (err) {
        // dispatch(setAlert(err.response.data.message, "danger")); Doesnt work 
        dispatch({
            type: LOAD_USER_FAIL
        });
    }

};

export const login = ({ email, password }) => async dispatch => {
    dispatch({
        type: LOGIN_START
    });

    const body = JSON.stringify({ email, password });

    try {
        const res = await axios.post('/api/user/login', body);


        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });
        dispatch(loadUser(localStorage.token));
    } catch (err) {
        dispatch(setAlert(err.response.data.message, "danger"));
        dispatch({
            type: LOGIN_FAIL,
        });
    }

};

// REGISTER
export const register = ({ name, email, password }) => async dispatch => {
    dispatch({
        type: REGISTER_START
    });

    const body = JSON.stringify({ name, email, password });

    try {
        const res = await axios.post('/api/user/signup', body);

        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        });
        dispatch(loadUser(localStorage.token));
    } catch (err) {
        dispatch(setAlert(err.response.data.message, "danger"));
        dispatch({
            type: REGISTER_FAIL
        });
    }
};

export const logout = () => dispatch => {
    dispatch({ type: LOGOUT });
    dispatch(clearMessages());
};

export const setAvatar = (avatar) => async dispatch => {
    dispatch({
        type: SET_AVATAR_START
    });

    const config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }
    const formData = new FormData();
    formData.append('avatar', avatar);

    try {
        const res = await axios.post('/api/user/avatar', formData, config);

        dispatch(setAlert(`Uploaded profile`, "success"));
        dispatch({
            type: SET_AVATAR_SUCCESS,
            payload: res.data
        });
    } catch (err) {
        dispatch(setAlert(err.response.data.message, "danger"));
        dispatch({
            type: SET_AVATAR_FAIL
        });
    }
};