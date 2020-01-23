import axios from '../../axios';

import {
    GET_LIKED_START,
    GET_LIKED_SUCCESS,
    GET_LIKED_FAIL,
    GET_PURCHASED_START,
    GET_PURCHASED_SUCCESS,
    GET_PURCHASED_FAIL,
    GET_SELLINGS_START,
    GET_SELLINGS_SUCCESS,
    GET_SELLINGS_FAIL,
    CLEAR_LIKED,
    CLEAR_PURCHASED,
    CLEAR_SELLINGS,
} from './actionType.js';
import { setAlert } from './alert';

const limit = 10;

export const getLiked = (skip = 0) => async dispatch => {
    dispatch({
        type: GET_LIKED_START,
    });

    try {
        const res = await axios.get(`/api/products?limit=${limit}&skip=${skip}&liked=true`);
        const hasMore = res.data.length >= limit;

        dispatch({
            type: GET_LIKED_SUCCESS,
            payload: {
                products: res.data,
                hasMore,
            }
        });
    } catch (err) {
        dispatch(setAlert(err.response.data.message, "danger"));
        dispatch({
            type: GET_LIKED_FAIL,
        });
    }
};
export const getPurchased = (skip = 0) => async dispatch => {
    dispatch({
        type: GET_PURCHASED_START,
    });

    try {
        const res = await axios.get(`/api/products?limit=${limit}&skip=${skip}&purchased=true`);
        const hasMore = res.data.length >= limit;

        dispatch({
            type: GET_PURCHASED_SUCCESS,
            payload: {
                products: res.data,
                hasMore,
            }
        });
    } catch (err) {
        dispatch(setAlert(err.response.data.message, "danger"));
        dispatch({
            type: GET_PURCHASED_FAIL,
        });
    }
};
export const getSellings = (skip = 0) => async dispatch => {
    dispatch({
        type: GET_SELLINGS_START,
    });

    try {
        const res = await axios.get(`/api/products?limit=${limit}&skip=${skip}&sellings=true`);
        const hasMore = res.data.length >= limit;

        dispatch({
            type: GET_SELLINGS_SUCCESS,
            payload: {
                products: res.data,
                hasMore,
            }
        });
    } catch (err) {
        dispatch(setAlert(err.response.data.message, "danger"));
        dispatch({
            type: GET_SELLINGS_FAIL,
        });
    }
};

export const clearLiked = () => async dispatch => {
    dispatch({
        type: CLEAR_LIKED,
    });
};
export const clearPurchased = () => async dispatch => {
    dispatch({
        type: CLEAR_PURCHASED,
    });
};
export const clearSellings = () => async dispatch => {
    dispatch({
        type: CLEAR_SELLINGS,
    });
};