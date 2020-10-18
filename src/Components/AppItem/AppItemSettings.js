import React from 'react';

import AppIcon from './AppIcon';

import styles from './AppItemSettings.module.css';

const AppItemSettings = _ => {
    return (
        <div className={styles["app-info-container"]}>
            <AppIcon size="5rem" />
        </div>
    );
}

export default AppItemSettings;