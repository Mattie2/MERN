import { SET_ALERT, REMOVE_ALERT } from '../actions/types';

const initialState = [];

export default function(state=initialState, action){
    // this saves constantly writing action.type and action.payload.  
    const {type, payload} = action;
    switch(type){
        case SET_ALERT:
            // state is immutable so new state is appended to current states
            return [...state, payload];
        case REMOVE_ALERT:
            return state.filter(alert => alert.id !== payload);
        default:
            return state;
    }
}