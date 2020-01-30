import {
    SET_SEARCH,
    SET_CATEGORY
} from '../actions/actionType.js';

const initialState = {
    search: "",
    category: ""
};

export default (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case SET_SEARCH:
            return {
                ...state,
                search: payload
            };
        case SET_CATEGORY:
            return {
                ...state,
                category: payload
            }
        default:
            return state
    };
};