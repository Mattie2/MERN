import axios from 'axios';
import { setAlert } from './alert';
import { GET_PROFILE, PROFILE_ERROR } from './types';

// Get current user's profile
export const getCurrentUsersProfile = () => async dispatch => {
    try{
        const res = await axios.get('/api/profile/me')
        dispatch({
            type: GET_PROFILE,
            payload:res.data
        });
    }catch(err){
        // console.error(err)
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

// Create/Update a profile
export const createProfile = (formData, navigate, edit = false) => async dispatch => {
    try {
        const config = {
            header: {
                'Content-Type': 'application/json'
            }
        }

        const res = await axios.post('/api/profile', formData, config);

        console.log(res)

        dispatch({
            type: GET_PROFILE,
            payload:res.data
        });

        dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created'));

        // if creating a new profile, redirect to a new page
        if (!edit){
            navigate('/dashboard');
        }
    }catch(err){
        console.error(err)
        const errors = err.response.data.errors;

        if (errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}