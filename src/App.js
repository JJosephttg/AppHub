import React, { Component } from 'react';

import ListingToolBar from './Containers/ListingToolBar/ListingToolBar';

import styles from './App.module.css';

const {app} = window.require('electron').remote;

const App = _ => {
  return (
    <div className={styles["main-root"]}>
      <ListingToolBar />
    </div>
  );
};

//Contains both layout for a modal dialog and page content
//Contains either a category layout or app layout

//Component layout:
/*
App
- Modal/any overlay - Shows Edit Page/loading, etc...
- CategoryPage
- AppListingPage
- header tools/search component
*/

export default App;
