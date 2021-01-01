import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
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

    const validateAppPath = () => {
        let errorMessage = "";
        let appPathStr = appPath ? appPath.trim() : "";

        if(!appPathStr) errorMessage = "App path must not be blank";

        setAppPathError(errorMessage);
        return !errorMessage;
    }

    useEffect(_ => { validateAppPath(); }, [appPath]);

    const [appName, setAppName] = useState("");
    const [appNameError, setAppNameError] = useState("");

    const validateAppName = () => {
        let errorMessage = "";
        let appNameStr = appName ? appName.trim() : "";

        if(!appNameStr) errorMessage = "App name must not be blank";
        else if(appNameStr.length > 50) errorMessage = "App name cannot be more than 50 characters in length";

        setAppNameError(errorMessage);
        return !errorMessage;
    };

    useEffect(_ => { validateAppName(); }, [appName]);

    const [category, setCategory] = useState("");
    const [categoryError, setCategoryError] = useState("");

    const [launchArgs, setLaunchArgs] = useState("");
    const [launchArgsError, setLaunchArgsError] = useState("");    
    
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
                    ImgSrc: null,
                    LaunchArgs: launchArgs.trim(),
                    IsFavorite: 1
                };
                
                ipcRenderer.invoke("DBUtility-SaveApp", app).then(isError => resolve(isError ? null : app));
            });            
        }
    }));
    
    useEffect(() => {
        ipcRenderer.invoke("DBUtility-GetCategories").then(
            (data) => data && !data.result ? null : setCategoryList(prevData => [...prevData, ...data.result])
        );
    }, []);

    const openFile = _ => {
        ipcRenderer.invoke("FileSystem-OpenFileDialog").then(
            fileResult => { if(!fileResult.canceled) setAppPath(fileResult.filePaths[0]); }
        );
    }

    return (
        <div>
            <TextField style={{marginBottom: "2rem"}} fullWidth size="small" 
                    label="Executable Path" color="secondary" variant="outlined"
                    value={appPath} required error={appPathError} helperText={appPathError}
                    onChange={event => setAppPath(event.target.value)}
                    InputProps={{
                        readOnly: true,
                        endAdornment:
                            <InputAdornment position="end">
                                <IconButton onClick={openFile} style={{height: "2rem", width: "2rem", boxShadow: "none"}}>
                                    <FolderIcon/>
                                </IconButton>
                            </InputAdornment>}}/>
            <div className={styles["app-settings-container"]}>
                <AppIcon size="10rem" />
                <div className={styles["app-info-container"]}>
                    <TextField margin="dense" size="small" fullWidth label="App Name" color="secondary" 
                        variant="outlined"
                        value={appName}
                        required
                        error={appNameError} helperText={appNameError}
                        onChange={event => setAppName(event.target.value)}/>
                    <Autocomplete freeSolo inputValue={category} 
                        onInputChange={(event, inputVal) => setCategory(inputVal)}
                        options={categoryList.map(c => c.CategoryName)}
                        renderInput={(params) => 
                            <TextField {...params} margin="dense" fullWidth size="small" label="Category" color="secondary" variant="outlined" />
                    }/>
                    <TextField margin="dense" size="small" fullWidth label="Launch Arguments" 
                        color="secondary" variant="outlined"
                        value={launchArgs}
                        onChange={event => setLaunchArgs(event.target.value)} />
                </div>
            </div>
            
        </div>
        
    );
});

export default AppItemSettings;