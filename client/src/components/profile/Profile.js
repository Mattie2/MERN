import React, {Fragment, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Spinner from '../layout/Spinner';
import ProfileTop from './ProfileTop';
import { getProfileById } from '../../actions/profile';

const Profile = ({ getProfileById, profile: {profile, loading}, auth }) => {
    // useEffect runs after every render, waits until getProfileById is loaded in this case as it's listed as a requirement
    const {id} = useParams()
    useEffect(() => {
        getProfileById(id);
    }, [getProfileById, id])

    return (
        <div className='container'>
            {profile === null || loading ? < Spinner /> : 
            <Fragment>
                <Link to='/profiles' className='btn btn-light'>
                    Back To Profiles
                </Link>
                {auth.isAuthenticated && auth.loading === false && auth.user._id === profile.user._id && (
                    <Link to='/edit-profile' className='btn btn-dark'>Edit Profile</Link>)}
                <div class='profile-grid my-1'>
                    <ProfileTop profile={profile}/>
                </div>
            </Fragment>}
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
