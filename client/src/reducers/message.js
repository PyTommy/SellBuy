import {
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
    recieved: [],
    sent: [],
    message: null,
    loading: {
        getRecieved: false,
        getSent: false,
        getMessage: false,
        sendMessage: false
    },
};

export default (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        // ===================
        // Get recieved messages
        // ===================
        case GET_RECIEVED_START:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    getRecieved: true
                }
            };
        case GET_RECIEVED_SUCCESS:
            return {
                ...state,
                recieved: payload,
                loading: {
                    ...state.loading,
                    getRecieved: false
                }
            }
        case GET_RECIEVED_FAIL:
            return {
                ...state,
                recieved: payload,
                loading: {
                    ...state.loading,
                    getRecieved: false
                }
            };
        // ===================
        // Get sent messages
        // ===================
        case GET_SENT_START:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    getSent: true
                }
            };
        case GET_SENT_SUCCESS:
            return {
                ...state,
                sent: payload,
                loading: {
                    ...state.loading,
                    getSent: false
                }
            }
        case GET_SENT_FAIL:
            return {
                ...state,
                sent: payload,
                loading: {
                    ...state.loading,
                    getSent: false
                }
            };
        // ===================
        // Get a message
        // ===================
        case GET_MESSAGE_START:
            let message = state.recieved.find((msg) => msg._id.toString() === payload);
            if (!message) {
                message = state.sent.find((msg) => msg._id.toString() === payload);
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
