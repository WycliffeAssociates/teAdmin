import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.css';
import {ToastContainer} from 'react-toastify';
import NotFound from './js/pages/NotFound';
import axios from 'axios';
import Authentication from './js/pages/Login/Authentication.js';
import ErrorPage from './js/pages/ErrorPage/ErrorPage.js';
import Dashboard from './js/pages/main/Dashboard.js';
import config from './config/config';
import { DragDropContext } from 'react-dnd';
import { default as TouchBackend } from 'react-dnd-touch-backend';

// import and configure the raven client for sentry in order to track errors
import Raven from 'raven-js';
Raven.config(`http://9183fe1745da4049889061d44d154a4b@${config.domain}:9000/3`).install();


class App extends Component {
  constructor(props) {
    super(props);

    //configuration for web requests
    axios.defaults.timeout = 120000;

    this.state ={
      hasError: false,
    };
  }

  componentDidCatch(error, info) {
    this.setState({hasError: true});
    Raven.captureException(error, {extra: info}); //send error to raven client
  }

  render() {
    return (
    /*
                This is a list of different possible routes and what components should
                be rendered for each one
    */

      <div>
        <ToastContainer style={{width: '25vw', padding: '0'}} />

        <Switch>
          <Route exact path = "/" component={Authentication} />
          <Route path = "/dashboard" component={Dashboard} />
          <Route path = "/errorPage" component={ErrorPage} />
          <Route path = "*" component={NotFound} />
        </Switch>

      </div>
    );
  }
}

export default DragDropContext(TouchBackend({ enableMouseEvents: true }))(App);
