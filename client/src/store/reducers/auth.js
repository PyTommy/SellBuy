import {
    LOAD_USER_START,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAIL,

    REGISTER,
    LOGIN,
    LOGOUT,

    UPDATE_AVATAR,
    UPDATE_PROFILE,
    UPDATE_EMAIL
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
        case REGISTER:
        case LOGIN:
            localStorage.setItem('token', payload.token);
            return {
                ...state,
                ...payload,
                isAuthenticated: true,
            };
        case UPDATE_AVATAR:
            return {
                ...state,
                user: {
                    ...state.user,
                    avatar: payload.avatar
                }
            };
        case UPDATE_PROFILE:
            return {
                ...state,
                user: payload
            };
        case UPDATE_EMAIL:
            return {
                ...state,
                user: {
                    ...state.user,
                    email: payload
                }
            }
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