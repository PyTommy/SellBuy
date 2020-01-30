import {
    GET_PROFILE_START,
    GET_PROFILE_SUCCESS,
    GET_PROFILE_FAIL,
    GET_PROFILE_PRODUCTS_START,
    GET_PROFILE_PRODUCTS_SUCCESS,
    GET_PROFILE_PRODUCTS_FAIL
} from '../actions/actionType';


const profileReducerDefaultState = {
    user: null,
    products: {
        products: [],
        hasMore: true,
        loading: false
    },
};

const profileReducer = (state = profileReducerDefaultState, { type, payload }) => {
    switch (type) {
        // ==================
        // Get profile
        // ==================
        case GET_PROFILE_START:
            return {
                ...state,
                products: {
                    ...profileReducerDefaultState.products
                }
            };
        case GET_PROFILE_SUCCESS:
            return {
                ...state,
                user: payload,
            };
        case GET_PROFILE_FAIL:
            return profileReducerDefaultState;
        // ==================
        // Get Products
        // ==================
        case GET_PROFILE_PRODUCTS_START:
            return {
                ...state,
                products: {
                    ...state.products,
                    loading: true
                }
            };
        case GET_PROFILE_PRODUCTS_SUCCESS:
            return {
                ...state,
                products: {
                    products: [...state.products.products, ...payload.products],
                    hasMore: payload.hasMore,
                    loading: false
                }
            };
        case GET_PROFILE_PRODUCTS_FAIL:
            return {
                ...state,
                products: {
                    products: [],
                    hasMore: false,
                    loading: false
                }
            };
        default:
            return state;
    };
};

export default profileReducer;