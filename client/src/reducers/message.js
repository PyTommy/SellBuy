import {
    GET_CONVERSATIONS_START,
    GET_CONVERSATIONS_SUCCESS,
    GET_CONVERSATIONS_FAIL,
} from '../actions/actionType';

const initialState = {
    conversations: [],
    messages: null,
    loading: {
        conversations: false,
        messages: true
    },
};

export default (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case GET_CONVERSATIONS_START:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    conversations: true
                }
            };
        case GET_CONVERSATIONS_SUCCESS:
            return {
                ...state,
                conversations: payload,
                loading: {
                    ...state.loading,
                    conversations: false
                }
            }
        case GET_CONVERSATIONS_FAIL:
            return {
                ...state,
                conversations: payload,
                loading: {
                    ...state.loading,
                    conversations: false
                }
            };
        default:
            return state;
    }
};
