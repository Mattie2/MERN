import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { Route, Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({component: Component, auth: {isAuthenticated, loading}}) => {
    // here the route is set to the login page unless the user is properly authenticated
//   return <Route {...rest} render={ props => !isAuthenticated && !loading ? (<Navigate to='/login'/>) : (<Component {...props}/>)} />
  return !isAuthenticated && !loading ? (<Navigate to='/login'/>) : (<Component/>) 
}

PrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute)
