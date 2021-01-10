import React from 'react';

import AppItem from '../AppItem/AppItem';

import styles from './AppListing.module.css';

const CategoryAppListing = props => {
    return (
        <div className={styles["app-list-container"]}>
            {props.categoryName ? <h1 className={styles["category-header"]}>{props.categoryName}</h1> : null}
            <div className={styles["app-listing-container"]}>
                {props.appList ? props.appList.map(app => <AppItem app={app} key={app.Id}/>) : null}
            </div>
        </div>
    );
}

export default CategoryAppListing;