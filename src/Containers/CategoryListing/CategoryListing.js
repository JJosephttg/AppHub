import React, { useEffect, useRef, useState } from 'react';
import { makeStyles, ThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

import CategoryAppListing from './CategoryAppListing';
import AppItemSettings from '../../Components/AppItem/AppItemSettings';

import styles from './CategoryListing.module.css';

const { ipcRenderer } = window.require('electron');

const theme = createMuiTheme({
    palette: {
      type: "dark",
      background: {
        paper: "rgb(50,50,50)"
      }
    }
  });


const useDialogStyle = makeStyles({
    paper: {
        borderRadius: "1rem"
    }
});

const CategoryListing = props => {
    const [favoritesList, setFavorites] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const appSettingsRef = useRef();

    const inputActionHandler = props.inputActionHandler;
    useEffect(() => {
        if(inputActionHandler) inputActionHandler({
            addHandler: () => setIsDialogOpen(true),
            searchHandler: () => {}
        });
    }, [inputActionHandler]);
    
    useEffect(() => {
        //Load in favorites
        ipcRenderer.invoke("DBUtility-GetFavorites", 15).then(
            data => {
                if(data.error) return;
                setFavorites([...data.result]);
            }
        );

        // Load max of 10-20 apps per category
    }, []);

    const dialogStyles = useDialogStyle();

    const saveNewApp = () => {
        appSettingsRef.current.saveApp().then(maybeApp => {
            //If app was not added successfully, keep the dialog open since validation errors or failure to add app
            if(maybeApp == null) return;

            ipcRenderer.invoke("DBUtility-GetFavorites", 15).then(
                data => {
                    if(data.error) return;
                    setFavorites([...data.result]);
                }
            );
            setIsDialogOpen(false);
        });
    }

    return (
        <div>
            <CategoryAppListing categoryName="Favorites" appList={favoritesList} />
            <ThemeProvider theme={theme}>
                <Dialog classes={dialogStyles} disableBackdropClick fullWidth open={isDialogOpen}
                        onClose={() => setIsDialogOpen(!isDialogOpen)}>
                            
                    <DialogTitle>
                        <DialogContentText>Add New App</DialogContentText>
                        <button className={`${styles.closeButton} btn`} onClick={() => setIsDialogOpen(false)}>
                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                        </button>
                    </DialogTitle>
                    <DialogContent className={`${dialogStyles.dialogText} ${dialogStyles.root}`}>
                        <AppItemSettings ref={appSettingsRef} />
                    </DialogContent>
                    <DialogActions>
                        <button onClick={saveNewApp} style={{float: "right", marginRight: "1rem", marginBottom: "1rem"}} className="btn btn-primary">Save</button>
                    </DialogActions>
                </Dialog>
            </ThemeProvider>
        </div>
    );
}


export default CategoryListing;