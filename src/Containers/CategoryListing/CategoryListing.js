import React, { useEffect, useState } from 'react';
import { makeStyles, ThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import { Dialog, DialogContent, DialogContentText, DialogTitle, IconButton } from '@material-ui/core';

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
    const [saveHandler, setSaveHandler] = useState(null);
    
    useEffect(() => {
        //Load in favorites
        if(props.inputActionHandler) props.inputActionHandler({
            addHandler: () => setIsDialogOpen(true),
            searchHandler: () => {}
        });

        ipcRenderer.invoke("DBUtility-GetFavorites").then(
            data => setFavorites(prevData => [...prevData, ...data.result])
        );
    }, []);

    const dialogStyles = useDialogStyle();

    return (
        <div>
            <CategoryAppListing categoryName="Favorites" appList={favoritesList} />
            <ThemeProvider theme={theme}>
                <Dialog classes={dialogStyles} disableBackdropClick fullWidth open={isDialogOpen}
                        onClose={() => setIsDialogOpen(!isDialogOpen)}>
                            
                    <DialogTitle>
                        <DialogContentText>Add New App</DialogContentText>
                        <button className={`${styles.closeButton} btn`} onClick={() => setIsDialogOpen(false)}>
                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                        </button>
                    </DialogTitle>
                    <DialogContent className={dialogStyles.dialogText}>
                        <AppItemSettings />
                        <br/>
                        <button onClick={() => setIsDialogOpen(false)} style={{float: "right"}} className="btn btn-primary">Save</button>
                    </DialogContent>
                </Dialog>
            </ThemeProvider>
        </div>
    );
}


export default CategoryListing;