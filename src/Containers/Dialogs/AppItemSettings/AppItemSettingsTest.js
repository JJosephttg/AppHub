import React, { useEffect, useState, useContext, useCallback, Fragment } from 'react';
import { IconButton, TextField, InputAdornment, Checkbox, DialogContentText } from '@material-ui/core';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import FolderIcon from '@material-ui/icons/Folder';
import { Autocomplete } from '@material-ui/lab';

import { MainAppContext } from '../../MainAppController/MainAppController';
import AppIcon from '../../../Components/AppIcon/AppIcon';
import MainAppDialog from '../MainAppDialog/MainAppDialog';

import styles from './AppItemSettings.module.css';

const { ipcRenderer } = window.require('electron');

const SettingsProvider = props => {
    const [categoryList, setCategoryList] = useState([]);

    const [appPath, setAppPath] = useState("");
    const [appPathError, setAppPathError] = useState("");

    const validateAppPath = useCallback(() => {
        let errorMessage = "";
        let appPathStr = appPath ? appPath.trim() : "";

        if(!appPathStr) errorMessage = "App path must not be blank";

        setAppPathError(errorMessage);
        return !errorMessage;
    }, [appPath]);

    useEffect(_ => { validateAppPath(); }, [validateAppPath]);

    const [appName, setAppName] = useState("");
    const [appNameError, setAppNameError] = useState("");

    const validateAppName = useCallback(() => {
        let errorMessage = "";
        let appNameStr = appName ? appName.trim() : "";

        if(!appNameStr) errorMessage = "App name must not be blank";
        else if(appNameStr.length > 50) errorMessage = "App name cannot be more than 50 characters in length";

        setAppNameError(errorMessage);
        return !errorMessage;
    }, [appName]);

    useEffect(_ => { validateAppName(); }, [validateAppName]);

    const [category, setCategory] = useState("");
    const [launchArgs, setLaunchArgs] = useState("");
    const [isFavorite, setIsFavorite] = useState(false);
    
    const [imgData, setImgData] = useState(null);

    const getImageData = _ => {
        //Todo: Find a better way to read in base64 string
        return new Promise((resolve, reject) => {
            ipcRenderer.invoke("ProcessUtility-GetImageData").then(data => resolve(data), error => reject(error));
        });
    }

    useEffect(() => {
        ipcRenderer.invoke("DBUtility-GetCategories").then(
            (data) => data && !data.result ? null : setCategoryList(prevData => [...data.result])
        );
    }, []);

    return <props.children {...{
        Title: props => <button onClick={validateAppPath}>Fuck</button>,
        Content: props => <h3>What? {appPathError}</h3>,
        Actions:
    }}/>;
}

export default SettingsProvider;

/*const AppItemSettings = (props) => {
    
    const saveApp = () => {
        // TODO: Add validation
        var isInvalid = false;
        isInvalid |= !validateAppName();
        isInvalid |= !validateAppPath();

        return new Promise((resolve) => {
            if(isInvalid) {
                resolve(null);
                return;
            }
            var app = {
                AppName: appName.trim(),
                AppPath: appPath.trim(),
                CategoryName: category.trim(),
                ImgSrc: imgData,
                LaunchArgs: launchArgs.trim(),
                IsFavorite: 1
            };
            
            ipcRenderer.invoke("DBUtility-SaveApp", app).then(isError => resolve(isError ? null : app));
        });
    };    

    const openFile = callback => {
        ipcRenderer.invoke("ProcessUtility-OpenFileDialog").then(
            fileResult => { if(!fileResult.canceled) callback(fileResult.filePaths[0]); }
        );
    }

    return (
        <MainAppDialog isOpen={props.isOpen} close={mainAppContext.closeAppSettingsDialog}
            title={
                <Fragment>
                        <DialogContentText>
                            <Checkbox icon={<FavoriteBorder/>} checkedIcon={<Favorite/>} title="Favorite" checked={isFavorite} onChange={e => setIsFavorite(e.target.checked)}/>
                            Add New App
                        </DialogContentText>
                        <button className={`${styles.closeButton} btn`} onClick={() => props.close()}>
                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                        </button>
                </Fragment>
            }
            actions={<button onClick={saveApp} style={{float: "right", marginRight: "1rem", marginBottom: "1rem"}} className="btn btn-primary">Save</button>}
            >
                <Fragment>
                    <TextField style={{marginBottom: "2rem"}} fullWidth size="small" 
                        label="Executable Path" color="secondary" variant="outlined"
                        value={appPath} required error={appPathError ? true : false} helperText={appPathError}
                        onChange={event => setAppPath(event.target.value)}
                        InputProps={{
                            readOnly: true,
                            endAdornment:
                                <InputAdornment position="end">
                                    <IconButton onClick={_ => openFile(setAppPath)} style={{height: "2rem", width: "2rem", boxShadow: "none"}}>
                                        <FolderIcon/>
                                    </IconButton>
                                </InputAdornment>}}
                    />
                    <div className={styles["app-settings-container"]}>
                        <AppIcon size="10rem" imgSrc={imgData} imageLoadFailed={_ => setImgData(null)}>
                            <button className="btn btn-primary" onClick={
                                _ => getImageData().then(data => { if(!data.canceled) setImgData(data.result); })
                            }>Change Image</button>
                        </AppIcon>
                        <div className={styles["app-info-container"]}>
                            <TextField size="small" fullWidth label="App Name" color="secondary" 
                                variant="outlined"
                                value={appName}
                                required
                                error={appNameError ? true : false}
                                onChange={event => setAppName(event.target.value)}/>
                            <p className={styles["error-text"]}>{appNameError}</p>
                            <Autocomplete freeSolo inputValue={category} 
                                onInputChange={(event, inputVal) => setCategory(inputVal)}
                                options={categoryList.map(c => c.CategoryName)}
                                renderInput={(params) => 
                                    <TextField {...params} fullWidth size="small" label="Category" color="secondary" variant="outlined" />
                            }/>
                            <p className={styles["error-text"]}></p>
                            <TextField size="small" fullWidth label="Launch Arguments" 
                                color="secondary" variant="outlined"
                                value={launchArgs}
                                onChange={event => setLaunchArgs(event.target.value)} />
                        </div>
                    </div>
                </Fragment>
        </MainAppDialog>
    );
};

export default AppItemSettings;*/