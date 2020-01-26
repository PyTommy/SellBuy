import {
    CLEAR_NOTIFICATIONS,

    GET_NOTIFICATIONS_START,
    GET_NOTIFICATIONS_SUCCESS,
    GET_NOTIFICATIONS_FAIL,

    COUNT_UNSEEN_NOTIFICATIONS
} from '../actions/actionType';

const initialState = {
    notifications: [],
    hasMore: true,
    loading: false,
    count: null
};

export default (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        // ===================
        // Get notifications
        // ===================
        case GET_NOTIFICATIONS_START:
            return {
                ...state,
                loading: true
            };
        case GET_NOTIFICATIONS_SUCCESS:
            return {
                ...state,
                notifications: [...state.notifications, ...payload.notifications],
                hasMore: payload.hasMore,
                loading: false,
                count: state.count - payload.countUnseenToSeen
            }
        case GET_NOTIFICATIONS_FAIL:
            return {
                ...state,
                loading: false
            };
        case CLEAR_NOTIFICATIONS:
            return {
                ...initialState
            }
        case COUNT_UNSEEN_NOTIFICATIONS:
            return {
                ...state,
                count: payload
            };
        default:
            return state;
    }
};
