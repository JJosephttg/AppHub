import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { MainAppContext } from '../../Containers/MainAppController/MainAppController';
import AppItem from '../AppItem/AppItem';
import AppItemSettings from '../../Containers/Dialogs/AppItemSettings/AppItemSettings';
import DeleteAppDialog from '../../Containers/Dialogs/DeleteAppDialog/DeleteAppDialog';

import styles from './AppListing.module.css';

const { ipcRenderer } = window.require('electron');

const AppListing = props => {
    const mainAppContext = useContext(MainAppContext);
    const containerStyle = {height: props.listingLink ? "auto" : "100%", display: "inline-block"};

    /* Put delete logic here to avoid having to prop it down from each listing screen and the main app controller plus 
    we really have no need to componentize that much since this isn't used in any other context.
    Also this needs to refresh the listing/have a callback */
    const deleteApp = app => {
        mainAppContext.openMainDialog(dialogProps => 
            <DeleteAppDialog {...{...dialogProps, app: app,
                    onDelete: _ => ipcRenderer.invoke("DBUtility-DeleteApp", app.Id).then(_ => props.updateListingHandler()), 
                    close: mainAppContext.closeMainDialog
            }} />
        );
    };

    const editApp = app => {
        mainAppContext.openMainDialog(dialogProps => 
            <AppItemSettings {...{...dialogProps, initialApp: app, 
                onSave: props.updateListingHandler, 
                close: mainAppContext.closeMainDialog
            }} />
        );
    };

    return (
        <div style={containerStyle} className={styles["app-list-container"]}>
            {props.displayName ? <h1 className={styles["category-header"]}>{props.displayName}</h1> : null}
            <div className={styles["app-listing-container"]}>
                {props.appList ? props.appList.map(app => 
                    <AppItem editAppHandler={editApp} deleteHandler={deleteApp} app={app} key={app.Id}/>
                ) : null}
            </div>
            {props.listingLink ? <Link to={`${props.listingLink}`} className={styles["view-all-link"]}>View All</Link>: null}
        </div>
    );
}

export default AppListing;