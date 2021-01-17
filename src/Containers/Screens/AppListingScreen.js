import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import AppListing from '../../Components/AppListing/AppListing';

const { ipcRenderer } = window.require('electron');

const AppListingScreen = _ => {
    const { categoryName } = useParams();
    const [appList, setAppList] = useState([]);

    useEffect(_ => {
        ipcRenderer.invoke("DBUtility-GetApps", categoryName).then(data => {
            if(!data.error) setAppList([...data.result]);
        });
    }, []);

    return <AppListing categoryName={categoryName} appList={appList}/>
};

export default AppListingScreen;