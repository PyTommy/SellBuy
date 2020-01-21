import axios from '../axios';
import {
    GET_PROFILE_START,
    GET_PROFILE_SUCCESS,
    GET_PROFILE_FAIL
} from './actionType';
import { setAlert } from './alert';

export const getProfile = (userId) => async dispatch => {
    dispatch({
        type: GET_PROFILE_START
    });

    try {
        const res = await axios.get(`/api/user/${userId}`);

        dispatch({
            type: GET_PROFILE_SUCCESS,
            payload: res.data
        });
    } catch (err) {
        dispatch(setAlert(err.response.data.message, "danger"));
        dispatch({
            type: GET_PROFILE_FAIL,
        });
    }

};