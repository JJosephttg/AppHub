import React, { useRef } from 'react';
import SettingsIcon from '@material-ui/icons/Settings';
import { Popper, MenuItem, Paper, MenuList, Grow, IconButton, ClickAwayListener } from '@material-ui/core';

import AppIcon from './AppIcon';
import TruncatedToolTip from '../Utility/TruncatedToolTip';

import styles from './AppItem.module.css';

const AppItem = props => {
    const appNameDescRef = useRef();
    const launchArgsDescRef = useRef();

    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const closeAndExecute = (event, handler) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) return;
        if(handler) handler();
        setOpen(false);
    };

    const handleListKeyDown = event => {
        if (event.key === 'Tab') {
          event.preventDefault();
          setOpen(false);
        }
    };

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
                    <IconButton style={{padding: 0}} size="small" ref={anchorRef} onClick={handleToggle}>
                        <SettingsIcon fontSize="small" style={{color: "white"}}/>
                    </IconButton>
                    <Popper color="secondary" open={open} anchorEl={anchorRef.current} transition>
                        {({ TransitionProps, placement }) => (
                            <Grow
                            {...TransitionProps}
                            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}>
                            <Paper color="secondary">
                                <ClickAwayListener onClickAway={closeAndExecute}>
                                <MenuList autoFocusItem={open} onKeyDown={handleListKeyDown}>
                                    <MenuItem onClick={event => closeAndExecute(event, () => props.deleteHandler(props.app))}>Delete...</MenuItem>
                                </MenuList>
                                </ClickAwayListener>
                            </Paper>
                            </Grow>
                        )}
                    </Popper>
                </div>
                <TruncatedToolTip ref={appNameDescRef} label={props.app.LaunchArgs} placement="bottom">
                    <p ref={launchArgsDescRef} className={`${styles["app-info"]} ${styles["app-info-more"]}`}>{props.app.LaunchArgs}</p>
                </TruncatedToolTip>
            </div>
        </div>
    );
};


export default AppItem;