import React, { useEffect, useState, useImperativeHandle, forwardRef, useCallback } from 'react';
import { IconButton, TextField, InputAdornment } from '@material-ui/core';
import FolderIcon from '@material-ui/icons/Folder';
import { Autocomplete } from '@material-ui/lab';

import AppIcon from './AppIcon';

import styles from './AppItemSettings.module.css';
const { ipcRenderer } = window.require('electron');

const AppItemSettings = forwardRef((props, ref) => {
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
    
    const [imgData, setImgData] = useState(null);

    const getImageData = _ => {
        //Todo: Find a better way to read in base64 string
        return new Promise((resolve, reject) => {
            ipcRenderer.invoke("ProcessUtility-GetImageData").then(data => resolve(data), error => reject(error));
        });
    }
    
    useImperativeHandle(ref, () => ({
        saveApp() {
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
        }
    }));
    
    useEffect(() => {
        ipcRenderer.invoke("DBUtility-GetCategories").then(
            (data) => data && !data.result ? null : setCategoryList(prevData => [...data.result])
        );
    }, []);

    const openFile = callback => {
        ipcRenderer.invoke("ProcessUtility-OpenFileDialog").then(
            fileResult => { if(!fileResult.canceled) callback(fileResult.filePaths[0]); }
        );
    }

    return (
        <div>
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
                            </InputAdornment>}}/>
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
            
        </div>
        
    );
});

export default AppItemSettings;