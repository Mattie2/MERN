import axios from 'axios';
import { setAlert } from './alert';
import { GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE } from './types';

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

        dispatch({
            type: GET_PROFILE,
            payload:res.data
        });

        dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'));

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

// Add experience
export const addExperience = (formData, navigate) => async dispatch => {
    try {
        const config = {
            header: {
                'Content-Type': 'application/json'
            }
        }

        const res = await axios.put('/api/profile/experience', formData, config);

        dispatch({
            type: UPDATE_PROFILE,
            payload:res.data
        });

        dispatch(setAlert('Added Experience', 'success'));

        navigate('/dashboard');

    }catch(err){
        console.error(err)
        const error = err.response.data;

        if (error){
            dispatch(setAlert(error.msg, 'danger'));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

// Delete experience
export const deleteExperience = (experienceID) => async dispatch => {
    try {
        const config = {
            header: {
                'Content-Type': 'application/json'
            }
        }


        const res = await axios.delete(`/api/profile/experience/${experienceID}`, config);

        dispatch({
            type: UPDATE_PROFILE,
            payload:res.data
        });

        dispatch(setAlert('Deleted Experience', 'success'));

    }catch(err){
        console.error(err)
        const error = err.response.data;

        if (error){
            dispatch(setAlert(error.msg, 'danger'));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

// Add education
export const addEducation = (formData, navigate) => async dispatch => {
    try {
        const config = {
            header: {
                'Content-Type': 'application/json'
            }
        }

        const res = await axios.put('/api/profile/education', formData, config);

        dispatch({
            type: UPDATE_PROFILE,
            payload:res.data
        });

        dispatch(setAlert('Added Education', 'success'));

        navigate('/dashboard');
        
    }catch(err){
        console.error(`error ${err}`)
        const error = err.response.data;

        if (error){
            dispatch(setAlert(error.msg, 'danger'));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

// Delete education
export const deleteEducation = (educationID) => async dispatch => {
    try {
        const config = {
            header: {
                'Content-Type': 'application/json'
            }
        }


        const res = await axios.delete(`/api/profile/education/${educationID}`, config);

        dispatch({
            type: UPDATE_PROFILE,
            payload:res.data
        });

        dispatch(setAlert('Deleted Education', 'success'));

    }catch(err){
        console.error(err)
        const error = err.response.data;

        if (error){
            dispatch(setAlert(error.msg, 'danger'));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}