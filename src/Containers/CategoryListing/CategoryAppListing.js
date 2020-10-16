import React from 'react';

import styles from './CategoryAppListing.module.css';

const CategoryAppListing = props => {
    //Try to use across pages

    return (
        <div>
            {props.categoryName ? <h1 className={styles["category-header"]}>{props.categoryName}</h1> : null}
            <div className={styles["app-list-container"]}>
                {props.appList ? props.appList.map(app => (
                    <div key={app.id} className={["card", styles["app-container"]].join(" ")}>
                        <div className={[styles["app-overlay-container"], "card-body"].join(" ")}>
                            <div className={styles["overlay"]}>
                                <div className={styles["overlay-button"]}>
                                    <svg viewBox="0 0 16 16" className="bi bi-play-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                                    </svg>
                                </div>
                            </div>
                            {app.ImgSrc ? <img src={app.ImgSrc} /> : (
                                <svg className={[styles["app-img"], "bi bi-window"].join(" ")} viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M14 2H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zM2 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2z"/>
                                    <path fillRule="evenodd" d="M15 6H1V5h14v1z"/>
                                    <path d="M3 3.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm1.5 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm1.5 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"/>
                                </svg>
                            )}
                        </div>
                        
                        <div className={[styles["app-desc-container"]].join(" ")}>
                            <p className={styles["app-info"]}>{app.AppName}</p>
                            <p className={[styles["app-info"], styles["app-info-more"]].join(" ")}>example of launch args</p>
                        </div>
                    </div>
                )) : null}
            </div>
        </div>
    );
}

export default CategoryAppListing;