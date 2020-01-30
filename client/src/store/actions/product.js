import axios from '../../axios';

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
} from './actionType.js';
import { setAlert } from './alert';

const config = {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
}

export const createProduct = (formData) => async dispatch => {
    try {
        await axios.post('/api/products', formData, config);
        dispatch(setAlert("Added Product", "success"));
    } catch (err) {
        dispatch(setAlert(err.response.data.message, "danger"));
    }
};

export const editProduct = (productId, formData) => async dispatch => {
    try {
        await axios.put(`/api/products/${productId}`, formData, config);
        dispatch(setAlert("Edited Product", "success"));
    } catch (err) {
        dispatch(setAlert(err.response.data.message, "danger"));
    }
};


export const getProducts = ({ skip = 0, limit = 15, search = null, category = null }) => async dispatch => {
    dispatch({
        type: GET_PRODUCTS_START
    });
    let queries = [];
    queries.push(`limit=${limit}`);
    queries.push(`skip=${skip}`);
    if (search) queries.push(`search=${search}`);
    if (category) queries.push(`category=${category}`);

    try {
        const res = await axios.get(`/api/products?${queries.join('&')}`);
        const hasMore = res.data.length === limit;
        dispatch({
            type: GET_PRODUCTS_SUCCESS,
            payload: {
                products: res.data,
                hasMore
            }
        });
    } catch (err) {
        dispatch(setAlert(err.response.data.message, "danger"));
        dispatch({
            type: GET_PRODUCTS_FAIL
        });
    }
};

export const refreshProducts = () => async dispatch => {
    dispatch({
        type: REFRESH_PRODUCTS
    });
};


export const getProduct = (productId) => async dispatch => {
    dispatch({
        type: GET_PRODUCT_START,
        payload: productId
    });

    try {
        const res = await axios.get(`/api/products/${productId}`);

        dispatch({
            type: GET_PRODUCT_SUCCESS,
            payload: res.data
        });
    } catch (err) {
        dispatch(setAlert(err.response.data.message, "danger"));
        dispatch({
            type: GET_PRODUCT_FAIL
        });
    }
};

export const deleteProduct = (productId) => async dispatch => {
    try {
        await axios.delete(`/api/products/${productId}`);

        dispatch({
            type: DELETE_PRODUCT,
            payload: productId
        });
        dispatch(setAlert("Product deleted", "success"));
    } catch (err) {
        dispatch(setAlert(err.response.data.message, "danger"));
    }
};

export const addComment = (productId, text, callback = () => { }) => async dispatch => {
    try {
        const res = await axios.post(`/api/products/comment/${productId}`, { text });

        dispatch(setAlert("Added Comment", "success"));
        dispatch({
            type: ADD_COMMENT,
            payload: res.data
        });
        callback();
    } catch (err) {
        dispatch(setAlert(err.response.data.message, "danger"));
        callback();
    }
};

export const setLike = (productId, callback) => async dispatch => {
    try {
        const res = await axios.put(`/api/products/like/${productId}`);
        dispatch({
            type: SET_LIKE,
            payload: res.data
        });
        callback();
    } catch (err) {
        dispatch(setAlert(err.response.data.message, "danger"));
        callback();
    }
};

export const setUnlike = (productId, callback) => async dispatch => {
    try {
        const res = await axios.put(`/api/products/unlike/${productId}`);
        dispatch({
            type: SET_UNLIKE,
            payload: res.data
        });
        callback();
    } catch (err) {
        dispatch(setAlert(err.response.data.message, "danger"));
        callback();
    }
};

export const purchaseProduct = (productId, cb = () => { }) => async dispatch => {
    try {
        const res = await axios.put(`/api/products/purchase/${productId}`);
        dispatch({
            type: PURCHASE_PRODUCT,
            payload: res.data
        });
        dispatch(setAlert("Purchased a product", "success"));
        cb();
    } catch (err) {
        dispatch(setAlert(err.response.data.message, "danger"));
        cb();
    }
};

export const cancelProduct = (productId, cb = () => { }) => async dispatch => {
    try {
        const res = await axios.put(`/api/products/cancel/${productId}`);
        dispatch({
            type: CANCEL_PRODUCT,
            payload: res.data
        });
        dispatch(setAlert("Canceled a product", "success"));
        cb();
    } catch (err) {
        dispatch(setAlert(err.response.data.message, "danger"));
        cb();
    }
};

export const rejectProduct = (productId, cb = () => { }) => async dispatch => {
    try {
        const res = await axios.put(`/api/products/reject/${productId}`);
        dispatch({
            type: REJECT_PRODUCT,
            payload: res.data
        });
        dispatch(setAlert("Reject a customer's purchase", "success"));
        cb();
    } catch (err) {
        dispatch(setAlert(err.response.data.message, "danger"));
        cb();
    }
};