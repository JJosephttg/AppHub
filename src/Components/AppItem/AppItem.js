import React, { useRef } from 'react';
import SettingsIcon from '@material-ui/icons/Settings';

import AppIcon from './AppIcon';
import TruncatedToolTip from '../Utility/TruncatedToolTip';

import styles from './AppItem.module.css';

const AppItem = props => {
    const appNameDescRef = useRef(), launchArgsDescRef = useRef();

    return (
        <div className={`card ${styles["app-container"]}`}>
            <AppIcon size="5.5rem" imgSrc={props.app.ImgSrc} >
            <div className={styles["overlay-button"]}>
                <svg viewBox="0 0 16 16" className="bi bi-play-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                </svg>
            </div>
            </AppIcon>
            <div className={styles["app-desc-container"]}>
                <div className={styles["app-title-settings-container"]}>
                    <TruncatedToolTip ref={appNameDescRef} label={props.app.AppName} placement="bottom">
                        <p ref={appNameDescRef} className={styles["app-info"]}>{props.app.AppName}</p>
                    </TruncatedToolTip>  
                    <SettingsIcon fontSize="small" style={{color: "white"}}/>
                </div>
                <TruncatedToolTip ref={appNameDescRef} label={props.app.LaunchArgs} placement="bottom">
                    <p ref={launchArgsDescRef} className={`${styles["app-info"]} ${styles["app-info-more"]}`}>{props.app.LaunchArgs}</p>
                </TruncatedToolTip>
            </div>
        </div>
    );
};


export default AppItem;