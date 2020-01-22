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
    SEND_MESSAGE_START,
    SEND_MESSAGE_SUCCESS,
    SEND_MESSAGE_FAIL,
    CLEAR_MESSAGES
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
        getMessage: false,
        sendMessage: false
    },
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
            return {
                ...state,
                message: payload,
                loading: {
                    ...state.loading,
                    getMessage: false
                }
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
        // ===================
        // Send a message
        // ===================
        case SEND_MESSAGE_START:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    sendMessage: true
                }
            };
        case SEND_MESSAGE_SUCCESS:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    sendMessage: false
                }
            }
        case SEND_MESSAGE_FAIL:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    sendMessage: false
                }
            };

        case CLEAR_MESSAGES:
            return {
                ...initialState
            }
        default:
            return state;
    }
};
