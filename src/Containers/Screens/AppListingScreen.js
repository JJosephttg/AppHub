import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams } from 'react-router-dom';

import AppListing from '../../Components/AppListing/AppListing';
import AppItemSettings from '../Dialogs/AppItemSettings/AppItemSettings';
import { MainAppContext } from '../MainAppController/MainAppController';

const { ipcRenderer } = window.require('electron');

const AppListingScreen = props => {
    const mainAppContext = useContext(MainAppContext);
    const categoryName = decodeURIComponent(useParams().categoryName);
    const [appList, setAppList] = useState([]);

    const updateListing = useCallback(_ => {
        ipcRenderer.invoke("DBUtility-GetApps", categoryName).then(data => {
            if(!data.error) setAppList([...data.result]);
        });
    }, [categoryName]);

    useEffect(updateListing, [categoryName]);

    useEffect(_ => {
        mainAppContext.setToolbarActions({
            addHandler: _ => mainAppContext.openMainDialog(props => 
                <AppItemSettings {...{...props, initialApp: {CategoryName: categoryName}, onSave: updateListing, close: mainAppContext.closeMainDialog}} />
            ),
            searchHandler: _ => {}
        });
        mainAppContext.setPageTitle(categoryName);
    }, [mainAppContext, categoryName, updateListing]);

    return <AppListing appList={appList}/>
};

export default AppListingScreen;