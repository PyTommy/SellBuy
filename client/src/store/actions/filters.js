import { SET_SEARCH, SET_CATEGORY } from '../actions/actionType';

export const setSearch = (search = "") => dispatch => {
    dispatch({
        type: SET_SEARCH,
        payload: search
    });
};

export const setCategory = (category = "") => dispatch => {
    dispatch({
        type: SET_CATEGORY,
        payload: category
    });
};

