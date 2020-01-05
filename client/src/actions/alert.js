import uuid from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './actionType'

export const setAlert = (message, alertType, timeout = 3000) => dispatch => {
    if ( message instanceof Array) {
        message.forEach((singleMessage) => {
            const id = uuid.v4();
            dispatch({
                type: SET_ALERT,
                payload: {
                    id,
                    msg: singleMessage.msg,
                    alertType
                }
            });
            setTimeout(() => {
                dispatch({
                    type: REMOVE_ALERT,
                    payload: id
                })
            }, timeout);
        })
    } else {
        const id = uuid.v4();
        dispatch({
                type: SET_ALERT,
                payload: {
                    id,
                    msg: message,
                    alertType
                }
            });
        setTimeout(() => {
            dispatch({
                type: REMOVE_ALERT,
                payload: id
            })
        }, timeout);
    }
};