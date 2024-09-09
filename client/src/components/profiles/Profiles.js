import React, {Fragement, useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Spinner from '../layout/Spinner';
import { getAllProfiles } from '../../actions/profile';

const Profiles = ({ getAllProfiles, profile: { profiles, loading} }) => {
    useEffect(() => {
        getAllProfiles();
    }, []);

    return (
        <div>
        
        </div>
    )
}

Profiles.propTypes = {
    getAllProfiles: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    profile: state.profile
})

export default connect(mapStateToProps, { getAllProfiles })(Profiles);
