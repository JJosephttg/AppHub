import React, { useContext, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { makeStyles, ThemeProvider, createMuiTheme} from '@material-ui/core/styles';

import { MainAppContext } from '../../MainAppController/MainAppController';

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
  },
  root: {
    paddingBottom: 0
  }
});

const MainAppDialog = props => {
    const dialogStyles = useDialogStyle();
    const mainAppContext = useContext(MainAppContext);
    return mainAppContext.mainDialogContainer ? ReactDOM.createPortal(
        <ThemeProvider theme={theme}>
            <Dialog container={mainAppContext.mainDialogContainer} classes={dialogStyles} 
                    disableBackdropClick fullWidth open={props.isOpen} disableScrollLock
                    onClose={props.close}>
                      {props.contentProvider 
                      ? <props.contentProvider onClose={props.close}>{
                          context => 
                            <Fragment>
                              <DialogTitle className={dialogStyles.root}>{context.Title}</DialogTitle>
                              <DialogContent className={`${dialogStyles.dialogText} ${dialogStyles.root}`}>{context.Content}</DialogContent>
                              <DialogActions>{context.Actions}</DialogActions>
                            </Fragment>
                          }
                        </props.contentProvider> 
                      : null }
            </Dialog>
        </ThemeProvider>, 
        mainAppContext.mainDialogContainer
    ) : null ;
}

export default MainAppDialog;