import React, {Fragment, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';
import CreateProfile from './components/profile-forms/CreateProfile';

// Redux
//Provider links redux and react together
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

import './App.css';

if ( localStorage.token ){
  setAuthToken(localStorage.token);
}

const App = () => { 
  // adding the [] at the end ensures this only runs once, when the app is mounted. 
  // It tells react that the effect doesn't depend on other states so only needs to be run on mount and unmount events 
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  
  return(
  // wrapping everything in provider so the entire app can access the redux state 
  <Provider store={store}>
  <Router>
    <Fragment>
      <Navbar />
      <Routes>
        <Route element={ <Landing/> } path="/"/>
        <Route element={< Register/>} path="/register"/>
        <Route element={ <Login/>} path="/login"/>
        <Route element={ <PrivateRoute component={Dashboard}/>} path="/dashboard"/>
        <Route element={ <PrivateRoute component={CreateProfile}/>} path="/create-profile"/>
      </Routes>

    </Fragment>
  </Router>
  </Provider>
)};

export default App;
