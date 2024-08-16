import { REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR, LOGIN_FAIL, LOGIN_SUCCESS } from '../actions/types';

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null
}

export default function(state = initialState, action) {
    const {type, payload } = action;
    
    switch (type){
        case USER_LOADED:
            // using ... because state is immutable
            // loading is false because we've gotten the response 
            return{
                ...state,
                isAuthenticated: true,
                loading: false,
                user: payload
            }
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:    
            localStorage.setItem('token', payload.token);
            return{
                ...state,
                ...payload,
                isAuthenticated: true,
                loading: false   
            }
        case AUTH_ERROR:
        case REGISTER_FAIL:
        case LOGIN_FAIL: 
            // ensure user is no longer logged in if they were previously
            localStorage.removeItem('token');
            return{
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false   
            }
        default:
            return state;
    }
}