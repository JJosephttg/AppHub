import React, { useState, useCallback } from 'react';
import { BrowserRouter, Switch, Route} from 'react-router-dom';

import ListingToolBar from '../../Components/ListingToolBar/ListingToolBar';
import CategoryListingScreen from '../Screens/CategoryListingScreen';
import MainAppDialog from '../Dialogs/MainAppDialog/MainAppDialog';

import styles from './MainAppController.module.css';
import OtherAppsScreen from '../Screens/OtherAppsScreen';
import AppListingScreen from '../Screens/AppListingScreen';

export const MainAppContext = React.createContext();

const MainAppController = _ => {
  const [inputActions, setInputActions] = useState({
    searchHandler: null,
    addHandler: null
  });

  const [toolbarTitle, setToolbarTitle] = useState();

  const [isMainDialogOpen, setIsMainDialogOpen] = useState(false);
  const [currentContentProvider, setCurrentContentProvider] = useState();

  const [appContext, setAppContext] = useState({
    closeMainDialog: _ => setIsMainDialogOpen(false),
    openMainDialog: contentProvider => {
      setCurrentContentProvider(_ => contentProvider);
      setIsMainDialogOpen(_ => true);
    },
    setPageTitle: setToolbarTitle,
    setToolbarActions: actionsHandler => setInputActions(actionsHandler)
  });

  const setMainDialogContainer = useCallback(
    reference => { setAppContext(current => ({...current, mainDialogContainer: reference})); }, []
  );

  //Possibly title bar
  return (
    <div className={styles["main-root"]} ref={setMainDialogContainer}>
      <BrowserRouter>
        <MainAppContext.Provider value={appContext}>
            <ListingToolBar title={toolbarTitle} inputActions={inputActions} />
            <div className={styles["page-container"]}>
              <Switch>
                <Route exact path="/">
                  <CategoryListingScreen />
                </Route>
                <Route exact path="/favorites">
                  <OtherAppsScreen isFavorites/>
                </Route>
                <Route exact path="/uncategorized">
                  <OtherAppsScreen />
                </Route>
                <Route exact path="/apps/:categoryName">
                  <AppListingScreen />
                </Route>
              </Switch>
            </div>
            <MainAppDialog contentProvider={currentContentProvider} close={appContext.closeMainDialog} isOpen={isMainDialogOpen}/>
        </MainAppContext.Provider>
      </BrowserRouter>
    </div>
  );
};

export default MainAppController;