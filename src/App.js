import React, { useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import ListingToolBar from './Containers/ListingToolBar/ListingToolBar';
import CategoryListing from './Containers/CategoryListing/CategoryListing';

import styles from './App.module.css';

const App = _ => {

  const [inputActions, setInputActions] = useState({
    addHandler: null,
    searchHandler: null
  });

  return (
    <div className={styles["main-root"]}>
      <BrowserRouter>
          <ListingToolBar inputActions={inputActions} />
          <Switch>
            <Route path="/">
              <CategoryListing inputActionHandler={setInputActions} />
            </Route>
          </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
