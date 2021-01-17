import React, { useState, useEffect } from 'react';

import AppListing from '../../Components/AppListing/AppListing';

const { ipcRenderer } = window.require('electron');

const OtherAppsScreen = props => {
    const [appList, setAppList] = useState([]);
    const isFavorites = props.isFavorites;

    useEffect(_ => {
        ipcRenderer.invoke(isFavorites ? "DBUtility-GetFavorites" : "DBUtility-GetApps").then(data => {
            if(!data.error) setAppList([...data.result]);
        });
    }, [isFavorites]);

    return <AppListing appList={appList} categoryName={props.isFavorites ? "Favorites" : "Other Apps"}/>
};

export default OtherAppsScreen;