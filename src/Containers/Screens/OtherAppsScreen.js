import React, { useState, useEffect, useContext, useCallback } from 'react';

import AppListing from '../../Components/AppListing/AppListing';
import AppItemSettings from '../Dialogs/AppItemSettings/AppItemSettings';
import { MainAppContext } from '../MainAppController/MainAppController';

const { ipcRenderer } = window.require('electron');

const OtherAppsScreen = props => {
    const mainAppContext = useContext(MainAppContext);
    const [appList, setAppList] = useState([]);
    const isFavorites = props.isFavorites;
    const [currentSearchTerm, setCurrentSearchTerm] = useState();

    const updateListing = useCallback(_ => {
        ipcRenderer.invoke(isFavorites ? "DBUtility-GetFavorites" : "DBUtility-GetApps", {search: currentSearchTerm}).then(data => {
            if(!data.error) setAppList([...data.result]);
        });
    }, [isFavorites, currentSearchTerm]);

    useEffect(updateListing, [currentSearchTerm]);

    useEffect(_ => {
        mainAppContext.setToolbarActions({
            addHandler: _ => mainAppContext.openMainDialog(props => 
                <AppItemSettings {...{...props, initialApp: {IsFavorite: isFavorites}, onSave: updateListing, close: mainAppContext.closeMainDialog}} />
            ),
            searchHandler: setCurrentSearchTerm
        });
        mainAppContext.setPageTitle(isFavorites ? "Favorites" : "Other Apps")
    }, [mainAppContext, isFavorites, updateListing]);

    return <AppListing updateListingHandler={updateListing} appList={appList}/>
};

export default OtherAppsScreen;