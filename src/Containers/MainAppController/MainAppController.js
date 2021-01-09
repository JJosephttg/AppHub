import React, { useState, useCallback } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import ListingToolBar from '../../Components/ListingToolBar/ListingToolBar';
import CategoryListing from '../CategoryListing/CategoryListing';
import MainAppDialog from '../Dialogs/MainAppDialog/MainAppDialog';

import styles from './MainAppController.module.css';

export const MainAppContext = React.createContext();

const MainAppController = _ => {
  const [inputActions, setInputActions] = useState({
    searchHandler: null,
    addHandler: null
  });

  const [isMainDialogOpen, setIsMainDialogOpen] = useState(false);
  const [currentContentProvider, setCurrentContentProvider] = useState();

  const [appContext, setAppContext] = useState({
    closeMainDialog: () => setIsMainDialogOpen(false),
    openMainDialog: (contentProvider) => {
      setCurrentContentProvider(() => contentProvider);
      setIsMainDialogOpen(() => true);
    }
  });

  const setMainDialogContainer = useCallback(
    reference => { setAppContext(current => ({...current, mainDialogContainer: reference})); }, []
  );

  //Possibly title bar
  return (
    <div className={styles["main-root"]}>
      <BrowserRouter>
        <MainAppContext.Provider value={appContext}>
          <div ref={setMainDialogContainer}>
            <ListingToolBar inputActions={inputActions} />
            <Switch>
              <Route path="/">
                <CategoryListing inputActionHandler={setInputActions} />
              </Route>
            </Switch>
            <MainAppDialog contentProvider={currentContentProvider} close={appContext.closeMainDialog} isOpen={isMainDialogOpen}/>
          </div>
        </MainAppContext.Provider>
      </BrowserRouter>
    </div>
  );
};

export default MainAppController;