import {
    SET_PRODUCT_START,
    SET_PRODUCT_SUCCESS,
    SET_PRODUCT_FAIL,
    GET_PRODUCTS_START,
    GET_PRODUCTS_SUCCESS,
    GET_PRODUCTS_FAIL,
    REFRESH_PRODUCTS_START,
    REFRESH_PRODUCTS_SUCCESS,
    REFRESH_PRODUCTS_FAIL,
    GET_PRODUCT_START,
    GET_PRODUCT_SUCCESS,
    GET_PRODUCT_FAIL,
    DELETE_PRODUCT_START,
    DELETE_PRODUCT_SUCCESS,
    DELETE_PRODUCT_FAIL,
    ADD_COMMENT_START,
    ADD_COMMENT_SUCCESS,
    ADD_COMMENT_FAIL,
    SET_LIKE_START,
    SET_LIKE_SUCCESS,
    SET_LIKE_FAIL,
    SET_UNLIKE_START,
    SET_UNLIKE_SUCCESS,
    SET_UNLIKE_FAIL,
    BUY_START,
    BUY_SUCCESS,
    BUY_FAIL,
} from '../actions/actionType.js';

const initialState = {
    products: [],
    product: null,
    loading: {
        setProduct: false,
        getProduct: false,
        getProducts: false,
        deleteProduct: false,
        comments: false,
        likes: false,
        buy: false,
    },
    hasMore: true,
};

export default (state = initialState, action) => {
    const {type, payload} = action;

    switch (type) {
        // ====================
        // Start
        // ====================
        case SET_PRODUCT_START:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    setProduct: true
                } 
            };
        case GET_PRODUCTS_START:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    getProducts: true
                } 
            };
        case REFRESH_PRODUCTS_START:
            return {
                ...state,
                hasMore: true,
                products: []
            };
        case GET_PRODUCT_START:
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
        case DELETE_PRODUCT_START:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    deleteProduct: true
                } 
            };
        case ADD_COMMENT_START:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    comments: true
                } 
            };
        case SET_LIKE_START:
        case SET_UNLIKE_START:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    likes: true
                } 
            }
        case BUY_START:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    buy: true
                } 
            }
        // ====================
        // SUCCESS
        // ====================
        case SET_PRODUCT_SUCCESS: // It could be something else
            return {
                ...state,
                loading: {
                    ...state.loading,
                    setProduct: false
                },
            };
        case GET_PRODUCTS_SUCCESS:
        case REFRESH_PRODUCTS_SUCCESS:
            if (payload.length === 0) {
                return {
                    ...state,
                    loading: {
                        ...state.loading,
                        getProducts: false
                    },
                    hasMore: false
                };
            }
            return {
                ...state,
                loading: {
                    ...state.loading,
                    getProducts: false
                },
                products: [...state.products, ...payload]
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
        case ADD_COMMENT_SUCCESS:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    comments: false
                },
                product: {
                    ...state.product,
                    comments: payload
                }
            };
        case SET_LIKE_SUCCESS:
        case SET_UNLIKE_SUCCESS:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    likes: false
                },
                product: {
                    ...state.product,
                    likes: payload
                }
            };
        case BUY_SUCCESS:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    buy: false
                },
                product: {
                    ...state.product,
                    ...payload
                } 
            };
        case DELETE_PRODUCT_SUCCESS:
            let product = state.product;
            if (state.product._id.toString() === payload) {
                product = null
            } 
            return {
                ...state,
                loading: {
                    ...state.loading,
                    deleteProduct: false
                },
                product
            }

        // ====================
        // FAIL
        // ====================
        case SET_PRODUCT_FAIL:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    setProduct: false
                },
            };
        case GET_PRODUCTS_FAIL:
        case REFRESH_PRODUCTS_FAIL:
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
        case DELETE_PRODUCT_FAIL:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    deleteProduct: false
                },
            };
        case ADD_COMMENT_FAIL:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    comments: false
                },
            };
        case SET_LIKE_FAIL:
        case SET_UNLIKE_FAIL:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    likes: false
                }
            };
        case BUY_FAIL:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    buy: false
                }
            };
        default:
            return state;
    }
};