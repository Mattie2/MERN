import React, {Fragment} from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Redux
//Provider links redux and react together
import { Provider } from 'react-redux';
import store from './store';

import './App.css';

const App = () => 
  // wrapping everything in provider so the entire app can access the redux state 
  <Provider store={store}>
  <Router>
    <Fragment>
      <Navbar />
      <Routes>
        <Route exact path="/" Component={ Landing }/>
      </Routes>
        <section className='container'>
          <Routes>
            <Route exact path="/register" Component={ Register}/>
            <Route exact path="/login" Component={ Login}/>
          </Routes>
        </section>

    </Fragment>
  </Router>
  </Provider>

export default App;
