import {
    GET_PROFILE_START,
    GET_PROFILE_SUCCESS,
    GET_PROFILE_FAIL,
} from '../actions/actionType';


const profileReducerDefaultState = {
    user: null,
    products: null,
    loading: {
        user: false,
        products: false
    }
};

const profileReducer = (state = profileReducerDefaultState, { type, payload }) => {
    switch (type) {
        case GET_PROFILE_START:
            return {
                ...state,
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
        default:
            return state;
    };
};

export default profileReducer;