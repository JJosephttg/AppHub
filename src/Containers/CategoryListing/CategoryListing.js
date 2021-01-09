import React, { useEffect, useState, useContext, Fragment } from 'react';

import { MainAppContext } from '../MainAppController/MainAppController';
import AppItemSettings from '../Dialogs/AppItemSettings/AppItemSettings';
import CategoryAppListing from './CategoryAppListing';

const { ipcRenderer } = window.require('electron');

const CategoryListing = props => {
    const mainAppContext = useContext(MainAppContext);
    const [favoritesList, setFavorites] = useState([]);
    
    const updateListing = _ => {
        //TODO: Update each category app listing
        // Load max of 10-20 apps per category

        //Load in favorites
        ipcRenderer.invoke("DBUtility-GetFavorites", 15).then(
            data => {
                if(data.error) return;
                setFavorites([...data.result]);
            }
        );
    }

    const inputActionHandler = props.inputActionHandler;
    useEffect(() => {
        if(inputActionHandler) inputActionHandler({
            addHandler: () => mainAppContext.openMainDialog(
                props => <AppItemSettings {...{...props, onSave: updateListing, close: mainAppContext.closeMainDialog}} />),
            searchHandler: () => {}
        });
    }, [inputActionHandler, mainAppContext]);
    
    useEffect(updateListing, []);

    return <Fragment>
            <CategoryAppListing categoryName="Favorites" appList={favoritesList} />
        </Fragment>;
}


export default CategoryListing;