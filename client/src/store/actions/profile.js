import axios from '../../axios';
import {
    GET_PROFILE_START,
    GET_PROFILE_SUCCESS,
    GET_PROFILE_FAIL,
    GET_PROFILE_PRODUCTS_START,
    GET_PROFILE_PRODUCTS_SUCCESS,
    GET_PROFILE_PRODUCTS_FAIL
} from './actionType';
import { setAlert } from './alert';

export const getProfile = (userId, cb = () => { }) => async dispatch => {
    dispatch({
        type: GET_PROFILE_START
    });

    try {
        const res = await axios.get(`/api/user/${userId}`);

        dispatch({
            type: GET_PROFILE_SUCCESS,
            payload: res.data
        });
        cb()
    } catch (err) {
        dispatch(setAlert(err.response.data.message, "danger"));
        dispatch({
            type: GET_PROFILE_FAIL,
        });
        cb()
    }
};

export const getProfileProducts = (userId, skip = 0, limit = 10) => async dispatch => {
    dispatch({
        type: GET_PROFILE_PRODUCTS_START
    });

    try {
        const res = await axios.get(`/api/products/sellings/${userId}?skip=${skip}&limit=${limit}`);
        const hasMore = res.data.length === limit;

        dispatch({
            type: GET_PROFILE_PRODUCTS_SUCCESS,
            payload: { products: res.data, hasMore }
        });
    } catch (err) {
        dispatch(setAlert(err.response.data.message, "danger"));
        dispatch({
            type: GET_PROFILE_PRODUCTS_FAIL,
        });
    }
};