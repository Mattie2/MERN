import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentUsersProfile } from '../../actions/profile';
import Spinner from '../layout/Spinner';

const Dashboard = ({
  getCurrentUsersProfile, 
  auth: { user }, 
  profile: {profile, loading}
}) => {
  useEffect(() => {
    getCurrentUsersProfile();
  }, []);

  // 
  return loading && profile === null ? <Spinner /> : <section className='container'>
        <h1 className='large text-primary'>Dashboard</h1>
        <p className='lead'>
          <i className='fas fa-user'></i> Welcome { user && user.name }
        </p>
    </section>
}

Dashboard.propTypes = {
  getCurrentUsersProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile
})

export default connect(mapStateToProps,{getCurrentUsersProfile}) (Dashboard)
