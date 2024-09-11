import React, {Fragment, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Spinner from '../layout/Spinner';
import { getProfileById } from '../../actions/profile';

const Profile = ({ getProfileById, profile: {profile, loading}, auth }) => {
    // useEffect runs after every render, waits until getProfileById is loaded in this case as it's listed as a requirement
    const {id} = useParams()
    useEffect(() => {
        getProfileById(id);
    }, [getProfileById])

    return (
        <div className='container'>
        profile
        </div>
    )
}

Profile.propTypes = {
    getProfileById: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    profile: state.profile,
    auth: state.auth
})

export default connect(mapStateToProps, {getProfileById})(Profile)
