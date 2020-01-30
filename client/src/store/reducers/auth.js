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

    UPDATE_AVATAR_SUCCESS,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_EMAIL_SUCCESS
} from '../actions/actionType';
import axios from '../../axios';

// ==========
// Reducers
// ==========
const authReducerDefaultState = {
    token: localStorage.token,
    isAuthenticated: false,
    loading: true,
    user: null
};

const authReducer = (state = authReducerDefaultState, { type, payload }) => {
    switch (type) {
        case REGISTER_START:
        case LOGIN_START:
        case LOAD_USER_START:
            return {
                ...state,
                loading: true
            };
        case LOAD_USER_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: { ...payload }
            };
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            localStorage.setItem('token', payload.token);
            return {
                ...state,
                ...payload,
                isAuthenticated: true,
                loading: false,
            };
        case UPDATE_AVATAR_SUCCESS:
            return {
                ...state,
                user: {
                    ...state.user,
                    avatar: payload.avatar
                }
            };
        case UPDATE_PROFILE_SUCCESS:
            return {
                ...state,
                user: payload
            };
        case UPDATE_EMAIL_SUCCESS:
            return {
                ...state,
                user: {
                    ...state.user,
                    email: payload
                }
            }
        case REGISTER_FAIL:
        case LOGIN_FAIL:
        case LOAD_USER_FAIL:
        case LOGOUT:
            localStorage.removeItem('token');
            axios.setAuthToken(null);
            return {
                token: null,
                isAuthenticated: false,
                loading: false,
                user: null
            }
        default:
            return state;
    };
};

export default authReducer;