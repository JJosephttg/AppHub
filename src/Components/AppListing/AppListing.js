import React from 'react';
import {Link} from 'react-router-dom';

import AppItem from '../AppItem/AppItem';

import styles from './AppListing.module.css';

const AppListing = props => {
    const containerStyle = {height: props.listingLink ? "auto" : "100%", display: "inline-block"};

    return (
        <div style={containerStyle} className={styles["app-list-container"]}>
            {props.categoryName ? <h1 className={styles["category-header"]}>{props.categoryName}</h1> : null}
            <div className={styles["app-listing-container"]}>
                {props.appList ? props.appList.map(app => <AppItem app={app} key={app.Id}/>) : null}
            </div>
            {props.listingLink ? <Link to={`${props.listingLink}`} className={styles["view-all-link"]}>View All</Link>: null}
        </div>
    );
}

export default AppListing;