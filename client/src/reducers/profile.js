import {
    PROFILE_ERROR,
    GET_PROFILE,
    UPDATE_PROFILE,
    CLEAR_PROFILE
} from '../actions/types';

const initialState = {
    profile: null,
    // for the profile listing page
    profiles: [],
    repos: [],
    loading: true,
    error: false
}

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch(type){
        case GET_PROFILE:
        case UPDATE_PROFILE:
            return {
                ...state,
                profile: payload,
                loading: false
            }
        case PROFILE_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            }
        case CLEAR_PROFILE:
            return {
                ...state,
                profile: null,
                repos: [],
                loading: false
            }
        default:
            return state;
    }
}