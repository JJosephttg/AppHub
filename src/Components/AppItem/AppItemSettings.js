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
    const [appName, setAppName] = useState("");
    const [category, setCategory] = useState("");
    const [launchArgs, setLaunchArgs] = useState("");
    
    useImperativeHandle(ref, () => ({
        saveApp() {
            
        }
    }));
    
    useEffect(() => {
        ipcRenderer.invoke("DBUtility-GetCategories").then(
            data => setCategoryList(prevData => [...prevData, ...data.result])
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
                    value={appPath}
                    onChange={event => setAppPath(event.target.value)}
                    InputProps={{endAdornment:
                        <InputAdornment position="end">
                            <IconButton onClick={openFile} style={{height: "2rem", width: "2rem", boxShadow: "none"}}><FolderIcon/></IconButton>
                        </InputAdornment>}}/>
            <div className={styles["app-settings-container"]}>
                <AppIcon size="10rem" />
                <div className={styles["app-info-container"]}>
                    <TextField margin="dense" size="small" fullWidth label="App Name" color="secondary" 
                        variant="outlined"
                        value={appName}
                        onChange={event => setAppName(event.target.value)}/>
                    <Autocomplete inputValue={category} onInputChange={(event, inputVal) => setCategory(inputVal)}
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