import axios from '../../axios';
import {
    CLEAR_RECIEVED_MESSAGES,

    CLEAR_SENT_MESSAGES,

    GET_RECIEVED_START,
    GET_RECIEVED_SUCCESS,
    GET_RECIEVED_FAIL,

    GET_SENT_START,
    GET_SENT_SUCCESS,
    GET_SENT_FAIL,

    GET_MESSAGE_START,
    GET_MESSAGE_SUCCESS,
    GET_MESSAGE_FAIL,

    CLEAR_MESSAGES,

    COUNT_UNSEEN_MESSAGES
} from './actionType';
import { setAlert } from './alert';

export const countUnseenMessages = () => async dispatch => {
    try {
        const res = await axios.get(`/api/messages/count`);
        dispatch({
            type: COUNT_UNSEEN_MESSAGES,
            payload: res.data.count
        });
    } catch (err) {
        dispatch(setAlert(err.response.data.message, "danger"));
    }
};

export const clearRecievedMessages = () => async dispatch => {
    dispatch({
        type: CLEAR_RECIEVED_MESSAGES
    });
    dispatch(countUnseenMessages());
};

export const clearSentMessages = () => async dispatch => {
    dispatch({
        type: CLEAR_SENT_MESSAGES
    });
};

export const getRecieved = (skip = 0, limit = 20) => async dispatch => {
    dispatch({
        type: GET_RECIEVED_START
    });

    try {
        const res = await axios.get(`/api/messages/recieved?skip=${skip}&limit=${limit}`);
        const hasMore = res.data.length < limit ? false : true;

        dispatch({
            type: GET_RECIEVED_SUCCESS,
            payload: { messages: res.data, hasMore }
        });
    } catch (err) {
        dispatch(setAlert(err.response.data.message, "danger"));
        dispatch({
            type: GET_RECIEVED_FAIL
        });
    }
};

export const getSent = (skip = 0, limit = 20) => async dispatch => {
    dispatch({
        type: GET_SENT_START
    });

    try {
        const res = await axios.get(`/api/messages/sent?skip=${skip}&limit=${limit}`);
        const hasMore = res.data.length < limit ? false : true;

        dispatch({
            type: GET_SENT_SUCCESS,
            payload: { messages: res.data, hasMore }
        });
    } catch (err) {
        dispatch(setAlert(err.response.data.message, "danger"));
        dispatch({
            type: GET_SENT_FAIL
        });
    }
};

export const getMessage = (messageId, cb) => async dispatch => {
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
        cb();
    } catch (err) {
        dispatch(setAlert(err.response.data.message, "danger"));
        dispatch({
            type: GET_MESSAGE_FAIL
        });
        cb();
    }
}
    ;
export const sendMessage = (recipientId, text) => async dispatch => {
    try {
        await axios.post(`/api/messages/${recipientId}`, { text });
        dispatch(setAlert("Message Sent", "success"));
    } catch (err) {
        dispatch(setAlert(err.response.data.message, "danger"));
    }
};

export const clearMessages = () => dispatch => {
    dispatch({ type: CLEAR_MESSAGES })
}
