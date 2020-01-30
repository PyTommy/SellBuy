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
} from '../actions/actionType';

const initialState = {
    recieved: {
        messages: [],
        hasMore: true,
        loading: false,
    },
    sent: {
        messages: [],
        hasMore: true,
        loading: false
    },
    message: null,
    loading: {
        getMessage: false
    },
    count: null
};

export default (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        // ===================
        // CLEAR messages
        // ===================
        case CLEAR_RECIEVED_MESSAGES:
            return {
                ...state,
                recieved: {
                    ...initialState.recieved
                }
            };
        case CLEAR_SENT_MESSAGES:
            return {
                ...state,
                sent: {
                    ...initialState.sent
                }
            };
        // ===================
        // Get recieved messages
        // ===================
        case GET_RECIEVED_START:
            return {
                ...state,
                recieved: {
                    ...state.recieved,
                    loading: true
                }
            };
        case GET_RECIEVED_SUCCESS:
            return {
                ...state,
                recieved: {
                    messages: [...state.recieved.messages, ...payload.messages],
                    hasMore: payload.hasMore,
                    loading: false
                }
            }
        case GET_RECIEVED_FAIL:
            return {
                ...state,
                recieved: {
                    ...state.recieved,
                    loading: false
                }
            };
        // ===================
        // Get sent messages
        // ===================
        case GET_SENT_START:
            return {
                ...state,
                sent: {
                    ...state.sent,
                    loading: true
                }
            };
        case GET_SENT_SUCCESS:
            return {
                ...state,
                sent: {
                    messages: [...state.sent.messages, ...payload.messages],
                    hasMore: payload.hasMore,
                    loading: false
                }
            }
        case GET_SENT_FAIL:
            return {
                ...state,
                sent: {
                    ...state.sent,
                    loading: false
                }
            };
        // ===================
        // Get a message
        // ===================
        case GET_MESSAGE_START:
            let message = state.recieved.messages.find((msg) => msg._id.toString() === payload);
            if (!message) {
                message = state.sent.messages.find((msg) => msg._id.toString() === payload);
            };
            if (!message) message = null;

            return {
                ...state,
                loading: {
                    ...state.loading,
                    getMessage: true
                },
                message
            };
        case GET_MESSAGE_SUCCESS:
            let decrease = 0;
            const newMessages = state.recieved.messages.map((message) => {
                if (payload._id.toString() === message._id.toString() && message.seen === false) {
                    message.seen = true;
                    decrease++
                }
                return message;
            });

            return {
                ...state,
                message: payload,
                loading: {
                    ...state.loading,
                    getMessage: false
                },
                recieved: {
                    ...state.recieved,
                    messages: newMessages
                },
                count: state.count - decrease
            }
        case GET_MESSAGE_FAIL:
            return {
                ...state,
                sent: payload,
                loading: {
                    ...state.loading,
                    getMessage: false
                }
            };

        case CLEAR_MESSAGES:
            return {
                ...initialState
            }
        case COUNT_UNSEEN_MESSAGES:
            return {
                ...state,
                count: payload
            };
        default:
            return state;
    }
};
