import React from 'react';

import styles from './CategoryAppListing.module.css';

const CategoryAppListing = props => {
    //Try to use across pages

    return (
        <div>
            {props.categoryName ? <h1 className={styles["category-header"]}>{props.categoryName}</h1> : null}
            {props.appList ? props.appList.map(app => (
                <div key={app.id} className={["card", styles["app-container"]].join(" ")}>
                    {app.ImgSrc ? <img src={app.ImgSrc} /> : (
                        <svg className={[styles["app-img"], "card-img-top", "bi bi-window"].join(" ")} viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M14 2H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zM2 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2z"/>
                            <path fillRule="evenodd" d="M15 6H1V5h14v1z"/>
                            <path d="M3 3.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm1.5 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm1.5 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"/>
                        </svg>
                    )}
                    <div className={["card-body", styles["app-desc-container"]].join(" ")}>
                        <h2 className={styles["app-title"]}>{app.AppName}</h2>
                    </div>
                </div>
            )) : null}
        </div>
    );
}

export default CategoryAppListing;