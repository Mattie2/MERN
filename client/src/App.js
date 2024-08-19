import React, {Fragment, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import Alert from './components/layout/Alert';

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
        <Route exact path="/" element={ <Landing/> }/>
      </Routes>
        <section className='container'>
          <Alert />
          <Routes>
            <Route exact path="/register" element={< Register/>}/>
            <Route exact path="/login" element={ <Login/>}/>
            <Route exact path="/dashboard" element={ <Dashboard/>}/>
          </Routes>
        </section>

    </Fragment>
  </Router>
  </Provider>
)};

export default App;
