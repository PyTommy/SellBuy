import axios from '../../axios';
import {
    CLEAR_NOTIFICATIONS,
    // GET
    GET_NOTIFICATIONS_START,
    GET_NOTIFICATIONS_SUCCESS,
    GET_NOTIFICATIONS_FAIL,

    COUNT_UNSEEN_NOTIFICATIONS
} from './actionType';
import { setAlert } from './alert';

export const countUnseenNotifications = () => async dispatch => {
    try {
        const res = await axios.get(`/api/notifications/count`);
        dispatch({
            type: COUNT_UNSEEN_NOTIFICATIONS,
            payload: res.data.count
        })
    } catch (err) {
        dispatch(setAlert(err.response.data.message, "danger"));
    }
};

export const clearNotifications = () => async dispatch => {
    dispatch({
        type: CLEAR_NOTIFICATIONS
    });
    dispatch(countUnseenNotifications());
};

export const getNotifications = (skip = 0, limit = 20) => async dispatch => {
    dispatch({
        type: GET_NOTIFICATIONS_START
    });

    try {
        const res = await axios.get(`/api/notifications?skip=${skip}&limit=${limit}`);
        const hasMore = res.data.notifications.length < limit ? false : true;

        dispatch({
            type: GET_NOTIFICATIONS_SUCCESS,
            payload: {
                notifications: res.data.notifications,
                countUnseenToSeen: res.data.countUnseenToSeen,
                hasMore
            }
        });
    } catch (err) {
        dispatch(setAlert(err.response.data.message, "danger"));
        dispatch({
            type: GET_NOTIFICATIONS_FAIL
        });
    }
};