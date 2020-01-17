import axios from '../axios';
import {
    // GE
    GET_CONVERSATIONS_START,
    GET_CONVERSATIONS_SUCCESS,
    GET_CONVERSATIONS_FAIL,
    GET_MESSAGES_START,
    GET_MESSAGES_SUCCESS,
    GET_MESSAGES_FAIL

} from './actionType';
import { setAlert } from './alert';

export const getConversations = () => async dispatch => {
    dispatch({
        type: GET_CONVERSATIONS_START
    });

    try {
        const res = await axios.get(`/api/messages`);
        console.log(res.data);

        dispatch({
            type: GET_CONVERSATIONS_SUCCESS,
            payload: res.data
        });
    } catch (err) {
        dispatch(setAlert(err.response.data.message, "danger"));
        dispatch({
            type: GET_CONVERSATIONS_FAIL
        });
    }
};