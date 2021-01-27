import React from 'react';

import styles from './AppIcon.module.css';

import defaultImage from '../../assets/AppIcon.png';

const AppIcon = props => {
    const size = props.size ?? "auto";
    const backgroundColor = props.imgSrc ? "#222222" : "red";
    return (
        <div className={`${styles["app-overlay-container"]} card-body`} 
             style={{height: size, width: size, maxWidth: size}}>
            <div className={styles["overlay"]}>
                {props.children}
            </div>
            <img className={styles["app-img"]} style={{backgroundColor: backgroundColor}} alt="" src={props.imgSrc || defaultImage}/>      
        </div>
    );
}

export default AppIcon;