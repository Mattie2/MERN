import React, {Fragment, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';
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
      <Alert />
      <Routes>
        <Route element={ <Landing/> } path="/"/>
        {/* <Route element={
                <section className="container">
                  <Alert />
                  <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                  </Routes>
                </section>
              }
        /> */}
        <Route element={< Register/>} path="/register"/>
        <Route element={ <Login/>} path="/login"/>
      </Routes>
        {/* <section className='container'>
          <Alert />
          <Routes>
            <Route element={< Register/>} path="/register"/>
            <Route element={ <Login/>} path="/login"/>
            {/* <Route exact path="/dashboard" element={ <Dashboard/>}/> }
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard/>}/>
            </Route>
          </Routes>
        </section> */}

    </Fragment>
  </Router>
  </Provider>
)};

export default App;
