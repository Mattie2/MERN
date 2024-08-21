import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentUsersProfile } from '../../actions/profile';

const Dashboard = ({getCurrentUsersProfile, auth, profile}) => {
  useEffect(() => {
    getCurrentUsersProfile();
  }, []);

  return (
    <section className='container'>
      Dashboard
    </section>
  )
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
