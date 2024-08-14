import { REGISTER_SUCCESS, REGISTER_FAIL } from '../actions/types';

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null
}

export default function(state = initialState, action) {
    const {type, payload } = action;
    
    switch (type){
        case REGISTER_SUCCESS:

            localStorage.setItem('token', payload.token);
            // using ... because state is immutable
            // loading is false because we've gotten the response 
            return{
                ...state,
                ...payload,
                isAuthenticated: true,
                loading: false   
            }
        case REGISTER_FAIL:
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