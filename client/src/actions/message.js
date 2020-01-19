import axios from '../axios';
import {
    // GET
    GET_RECIEVED_START,
    GET_RECIEVED_SUCCESS,
    GET_RECIEVED_FAIL,
    GET_SENT_START,
    GET_SENT_SUCCESS,
    GET_SENT_FAIL,
    GET_MESSAGE_START,
    GET_MESSAGE_SUCCESS,
    GET_MESSAGE_FAIL,
    SEND_MESSAGE_START,
    SEND_MESSAGE_SUCCESS,
    SEND_MESSAGE_FAIL,
    CLEAR_MESSAGES
} from './actionType';
import { setAlert } from './alert';

export const getRecieved = () => async dispatch => {
    dispatch({
        type: GET_RECIEVED_START
    });

    try {
        const res = await axios.get(`/api/messages`);

        dispatch({
            type: GET_RECIEVED_SUCCESS,
            payload: res.data
        });
    } catch (err) {
        dispatch(setAlert(err.response.data.message, "danger"));
        dispatch({
            type: GET_RECIEVED_FAIL
        });
    }
};

export const getSent = () => async dispatch => {
    dispatch({
        type: GET_SENT_START
    });

    try {
        const res = await axios.get(`/api/messages/sent`);

        dispatch({
            type: GET_SENT_SUCCESS,
            payload: res.data
        });
    } catch (err) {
        dispatch(setAlert(err.response.data.message, "danger"));
        dispatch({
            type: GET_SENT_FAIL
        });
    }
};

export const getMessage = (messageId) => async dispatch => {
    dispatch({
        type: GET_MESSAGE_START,
        payload: messageId
    });

    try {
        const res = await axios.get(`/api/messages/${messageId}`);

        dispatch({
            type: GET_MESSAGE_SUCCESS,
            payload: res.data
        });
    } catch (err) {
        dispatch(setAlert(err.response.data.message, "danger"));
        dispatch({
            type: GET_MESSAGE_FAIL
        });
    }
}
    ;
export const sendMessage = (recipientId, text) => async dispatch => {
    dispatch({
        type: SEND_MESSAGE_START,
    });

    try {
        await axios.post(`/api/messages/${recipientId}`, { text });

        dispatch({
            type: SEND_MESSAGE_SUCCESS,
        });
    } catch (err) {
        dispatch(setAlert(err.response.data.message, "danger"));
        dispatch({
            type: SEND_MESSAGE_FAIL
        });
    }
};

export const clearMessages = () => dispatch => {
    dispatch({
        type: CLEAR_MESSAGES
    })
}
