import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams } from 'react-router-dom';

import AppListing from '../../Components/AppListing/AppListing';
import AppItemSettings from '../Dialogs/AppItemSettings/AppItemSettings';
import { MainAppContext } from '../MainAppController/MainAppController';

const { ipcRenderer } = window.require('electron');

const AppListingScreen = _ => {
    const mainAppContext = useContext(MainAppContext);
    const categoryName = decodeURIComponent(useParams().categoryName);
    const [appList, setAppList] = useState([]);
    const [currentSearchTerm, setCurrentSearchTerm] = useState();

    const updateListing = useCallback(_ => {
        ipcRenderer.invoke("DBUtility-GetApps", categoryName, {search: currentSearchTerm}).then(data => {
            if(!data.error) setAppList([...data.result]);
        });
    }, [categoryName, currentSearchTerm]);

    useEffect(updateListing, [categoryName, currentSearchTerm]);

    useEffect(_ => {
        mainAppContext.setToolbarActions({
            addHandler: _ => mainAppContext.openMainDialog(props => 
                <AppItemSettings {...{...props, initialApp: {CategoryName: categoryName}, onSave: updateListing, close: mainAppContext.closeMainDialog}} />
            ),
            searchHandler: setCurrentSearchTerm
        });
        mainAppContext.setPageTitle(categoryName);
    }, [mainAppContext, categoryName, updateListing]);

    return <AppListing updateListingHandler={updateListing} appList={appList}/>
};

export default AppListingScreen;