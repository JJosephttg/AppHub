import React from 'react';

import styles from './CategoryAppListing.module.css';

const CategoryAppListing = props => {
    //Try to use across pages

    return (
        <div>
            {props.categoryName ? <h1 className={styles["category-header"]}>{props.categoryName}</h1> : null}
            {props.appList ? props.appList.map(app => (
                <div key={app.ID} className={styles["app-container"]}>
                    
                    <h2 className={styles["app-title"]}>{app.AppName}</h2>
                </div>
            )) : null}
        </div>
    );
}

export default CategoryAppListing;