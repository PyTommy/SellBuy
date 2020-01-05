import {SET_ALERT, REMOVE_ALERT} from '../actions/actionType';

// Initial state
const alertReducerDefaultState = [];

// Example of the state
// [{ id, alertType, msg }, ...]

const authReducer = (state = alertReducerDefaultState, action) => {
    const { type, payload } = action;

    switch (type) {
        case SET_ALERT: 
            return [...state, payload];
        case REMOVE_ALERT:
            return state.filter(alert => alert.id !== payload);
        default: 
            return state;
    };
};

export default authReducer;