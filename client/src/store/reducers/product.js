import {
    GET_PRODUCTS_START,
    GET_PRODUCTS_SUCCESS,
    GET_PRODUCTS_FAIL,
    REFRESH_PRODUCTS,

    GET_PRODUCT_START,
    GET_PRODUCT_SUCCESS,
    GET_PRODUCT_FAIL,

    DELETE_PRODUCT,

    ADD_COMMENT,
    SET_LIKE,
    SET_UNLIKE,
    PURCHASE_PRODUCT,
    CANCEL_PRODUCT,
    REJECT_PRODUCT,
} from '../actions/actionType.js';

const initialState = {
    products: [],
    hasMore: true,
    product: null,
    loading: {
        getProduct: false,
        getProducts: false,
    },
    mylist: {
        liked: {
            hasMore: true,
            products: []
        },
        purchased: {
            hasMore: true,
            products: []
        },
        sellings: {
            hasMore: true,
            products: []
        }
    },
};

export default (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        // ====================
        // Start
        // ====================
        case GET_PRODUCTS_START:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    getProducts: true
                }
            };
        case REFRESH_PRODUCTS:
            return {
                ...state,
                hasMore: true,
                products: [],
            };
        case GET_PRODUCT_START:
            // concat state.products,
            let existingProduct = state.products.find((product) => product._id.toString() === payload);
            let shouldBeLoading = false;
            if (!existingProduct) {
                existingProduct = null;
                shouldBeLoading = true;
            }
            return {
                ...state,
                loading: {
                    ...state.loading,
                    getProduct: shouldBeLoading
                },
                product: existingProduct
            };
        // ====================
        // SUCCESS
        // ====================
        case GET_PRODUCTS_SUCCESS:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    getProducts: false
                },
                hasMore: payload.hasMore,
                products: [...state.products, ...payload.products]
            };
        case GET_PRODUCT_SUCCESS:
            return {
                ...state,
                product: payload,
                loading: {
                    ...state.loading,
                    getProduct: false
                },
            };
        case ADD_COMMENT:
            return {
                ...state,
                product: {
                    ...state.product,
                    comments: payload
                }
            };
        case SET_LIKE:
        case SET_UNLIKE:
            return {
                ...state,
                product: {
                    ...state.product,
                    likes: payload
                }
            };
        case PURCHASE_PRODUCT:
        case CANCEL_PRODUCT:
        case REJECT_PRODUCT:
            return {
                ...state,
                product: {
                    ...state.product,
                    ...payload
                }
            };
        case DELETE_PRODUCT:
            let product = state.product;
            if (state.product._id.toString() === payload) {
                product = null
            }
            return {
                ...state,
                product
            }

        // ====================
        // FAIL
        // ====================
        case GET_PRODUCTS_FAIL:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    getProducts: false
                },
            };
        case GET_PRODUCT_FAIL:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    getProduct: false
                },
            };
        default:
            return state;
    }
};