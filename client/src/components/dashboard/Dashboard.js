import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentUsersProfile } from '../../actions/profile';
import { Link } from 'react-router-dom';

import Spinner from '../layout/Spinner';
import Alert from '../layout/Alert';
import DashboardActions from './DashboardActions';
import Experience from './Experience';

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
        <Alert />
        <h1 className='large text-primary'>Dashboard</h1>
        <p className='lead'>
          <i className='fas fa-user'></i> Welcome { user && user.name }
        </p>
        {profile !== null ? (
          <Fragment>
            <DashboardActions />
            <Experience experience={profile.experience} />
          </Fragment>
          ) : (
          <Fragment>
            <p class='alert alert-danger'>There is no profile associated with this account. Please create your profile. </p>
            <Link to='/create-profile' className='btn btn-primary my-1'>Create profile</Link> 
            </Fragment>
          )}
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
