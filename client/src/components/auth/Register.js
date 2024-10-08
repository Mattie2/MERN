import React, { Fragment, useState } from 'react'
import { connect } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types'
import Alert from '../layout/Alert';

const Register = ({setAlert, register, isAuthenticated}) => {
    // setting default values for the form
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    });

    const { name, email, password, password2 } = formData;

    // ...formData creates a copy of formData
    // only updates the changed form value
    const onChange = e => setFormData({...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
            e.preventDefault();
            if (password !== password2){
                setAlert('Passwords do not match!', 'danger')
            }else{
                console.log('success');
                register( {name, email, password})
            }
    };

    // Redirect if logged in
    if(isAuthenticated){
        return <Navigate to='/dashboard'/>
    }

    return (
        <section className='container'>
            <Alert />
            <h1 className="large text-primary">
                Sign Up
            </h1>
            <p className="lead">
                <i className="fas fa-user"></i>
                Create Your Account
            </p>
            <form className="form" onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                    <input type="text" placeholder="Name" name='name' value={name} onChange={e=>onChange(e)} />
                </div>
                <div className="form-group">
                    <input type="email" placeholder="Email Address" name='email' value={email} onChange={e=>onChange(e)} />
                    <small className="form-text">This site uses Gravatar, so use a Gravatar email if you want a profile picture</small>
                </div>
                <div className="form-group">
                    <input type="password" placeholder="Password" name='password' value={password} onChange={e=>onChange(e)}/>
                </div>
                <div className="form-group">
                    <input type="password" placeholder="Confirm Password" name='password2' value={password2}  onChange={e=>onChange(e)}/>
                </div>
                <input type="submit" value="Register" className="btn btn-primary"/>
            </form>
            <p className="my-1">
                Already have an account? <Link to="/login">Sign In</Link>
            </p>
        </section>
    )
}

Register.propTypes={
    setAlert: PropTypes.func.isRequired,
    register:PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, {setAlert, register})(Register);
