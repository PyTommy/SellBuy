import {
    GET_LIKED_START,
    GET_LIKED_SUCCESS,
    GET_LIKED_FAIL,
    GET_PURCHASED_START,
    GET_PURCHASED_SUCCESS,
    GET_PURCHASED_FAIL,
    GET_SELLINGS_START,
    GET_SELLINGS_SUCCESS,
    GET_SELLINGS_FAIL,
    CLEAR_LIKED,
    CLEAR_PURCHASED,
    CLEAR_SELLINGS,
} from '../actions/actionType.js';

const initialState = {
    liked: {
        products: [],
        hasMore: true,
        loading: false
    },
    purchased: {
        products: [],
        hasMore: true,
        loading: false,
    },
    sellings: {
        products: [],
        hasMore: true,
        loading: false
    }
};

export default (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        // ===============
        // CLEAR to refresh
        // ===============
        case CLEAR_LIKED:
            return {
                ...state,
                liked: { ...initialState.liked }
            }
        case CLEAR_PURCHASED:
            return {
                ...state,
                purchased: { ...initialState.purchased }
            }
        case CLEAR_SELLINGS:
            return {
                ...state,
                sellings: { ...initialState.sellings }
            }

        // ===============
        // GET LIKED
        // ===============
        case GET_LIKED_START:
            return {
                ...state,
                liked: {
                    ...state.liked,
                    loading: true
                }
            }
        case GET_LIKED_SUCCESS:
            return {
                ...state,
                liked: {
                    products: payload.products,
                    loading: false,
                    hasMore: payload.hasMore
                }
            }
        case GET_LIKED_FAIL:
            return {
                ...state,
                liked: {
                    ...state.liked,
                    loading: false,
                }
            }
        // ===============
        // GET Purchased
        // ===============
        case GET_PURCHASED_START:
            return {
                ...state,
                purchased: {
                    ...state.purchased,
                    loading: true
                }
            }
        case GET_PURCHASED_SUCCESS:
            return {
                ...state,
                purchased: {
                    products: payload.products,
                    loading: false,
                    hasMore: payload.hasMore
                }
            }
        case GET_PURCHASED_FAIL:
            return {
                ...state,
                purchased: {
                    ...state.purchased,
                    loading: false,
                }
            }
        // ===============
        // GET SELLINGS
        // ===============
        case GET_SELLINGS_START:
            return {
                ...state,
                sellings: {
                    ...state.sellings,
                    loading: true
                }
            }
        case GET_SELLINGS_SUCCESS:
            return {
                ...state,
                sellings: {
                    products: payload.products,
                    loading: false,
                    hasMore: payload.hasMore
                }
            }
        case GET_SELLINGS_FAIL:
            return {
                ...state,
                sellings: {
                    ...state.sellings,
                    loading: false,
                }
            }
        default:
            return state
    };
};