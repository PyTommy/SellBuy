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
    loading: {
        user: false,
        products: false
    },
    products: {
        products: [],
        hasMore: true,
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
                },
                loading: {
                    ...state.loading,
                    user: true
                }
            };
        case GET_PROFILE_SUCCESS:
            return {
                ...state,
                user: payload,
                loading: {
                    ...state.loading,
                    user: false
                }
            };
        case GET_PROFILE_FAIL:
            return profileReducerDefaultState;
        // ==================
        // Get Products
        // ==================
        case GET_PROFILE_PRODUCTS_START:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    products: true
                }
            };
        case GET_PROFILE_PRODUCTS_SUCCESS:
            return {
                ...state,
                products: {
                    products: [...state.products.products, ...payload.products],
                    hasMore: payload.hasMore,
                },
                loading: {
                    ...state.loading,
                    products: false
                }
            };
        case GET_PROFILE_PRODUCTS_FAIL:
            return {
                ...state,
                products: {
                    products: [],
                    hasMore: false
                },
                loading: {
                    ...state.loading,
                    products: false
                }
            };
        default:
            return state;
    };
};

export default profileReducer;