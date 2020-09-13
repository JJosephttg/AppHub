import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Link, Route } from 'react-router-dom';
import logo from './logo.svg';
import styles from './App.module.css';

const {app} = window.require('electron').remote;

class App extends Component {
  render() {
    return (
      <Router>
        <div className={styles["main-layout"]}>
          <nav className={styles.sidebar}>
            <div className={styles["side-nav-heading"]}>
              <Link className={styles["side-nav-link"]} to="/">AppHub</Link>
            </div>
    	    </nav>
          <div className={styles["menu-btn"]}>
            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-list" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M2.5 11.5A.5.5 0 0 1 3 11h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 7h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 3h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
            </svg>
          </div>
          <Switch>
            <Route path="/">

            </Route>
          </Switch>
        </div>
      </Router>
      
    );
  }
}

/*
<div className={styles["side-nav"]}>
            <div className={styles["side-nav-heading"]}>
              <h1>AppHub</h1>
            </div>
            <Link className={styles["side-nav-link"]} to="/">Home</Link>
          </div>*/

export default App;
