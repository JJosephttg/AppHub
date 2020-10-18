import React from 'react';
import AppIcon from '../../Components/AppItem/AppIcon';

import styles from './CategoryAppListing.module.css';

const CategoryAppListing = props => {
    return (
        <div className={styles["app-list-container"]}>
            {props.categoryName ? <h1 className={styles["category-header"]}>{props.categoryName}</h1> : null}
            <div className={styles["app-listing-container"]}>
                {props.appList ? props.appList.map(app => (
                    <div key={app.id} className={`card ${styles["app-container"]}`}>
                        <div className={`${styles["app-overlay-container"]} card-body`}>
                            <div className={styles["overlay"]}>
                                <div className={styles["overlay-button"]}>
                                    <svg viewBox="0 0 16 16" className="bi bi-play-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                                    </svg>
                                </div>
                            </div>
                            <AppIcon imgSrc={app.ImgSrc} />
                        </div>
                        
                        <div className={styles["app-desc-container"]}>
                            <p className={styles["app-info"]}>{app.AppName}</p>
                            <p className={`${styles["app-info"]} ${styles["app-info-more"]}`}> </p>
                        </div>
                    </div>
                )) : null}
            </div>
        </div>
    );
}

export default CategoryAppListing;