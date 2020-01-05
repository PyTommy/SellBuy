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

    SET_AVATAR_START,
    SET_AVATAR_SUCCESS,
    SET_AVATAR_FAIL,
} from '../actions/actionType';
import axios from '../axios';

// ==========
// Reducers
// ==========
const authReducerDefaultState = {
    token: localStorage.token,
    isAuthenticated: false,
    loading: false,
    user: null
};
const authReducer = (state = authReducerDefaultState, {type, payload}) => {
    switch (type) {
        case REGISTER_START:
        case LOGIN_START:
        case LOAD_USER_START:
        case SET_AVATAR_START:
            return {
                ...state,
                loading: true
            };
        case LOAD_USER_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: {...payload}
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
        case SET_AVATAR_SUCCESS:
            return {
                ...state,
                loading: false,
                // user: {
                //     ...state.user,
                //     avatar: payload
                // } // @@@ TO DO later
            };
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
        case SET_AVATAR_FAIL:
            return {
                ...state,
                loading: false
            };
        default: 
            return state;
    };
};

export default authReducer;