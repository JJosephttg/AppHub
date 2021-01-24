import React from 'react';

import styles from './DeleteAppDialog.module.css';

const DeleteAppDialog = props => {
    return <props.children {...{
        Title: <div>Delete App</div>,
        Content: (<div className={styles["content-container"]}>Are you sure you want to delete '{props.app.AppName}'?</div>),
        Actions: (
            <div className={styles["actions-container"]}>
                <button onClick={_ => { props.onDelete(); props.onClose();}} className="btn btn-danger">Delete</button>
                <button onClick={props.onClose} className="btn btn-primary">Cancel</button>
            </div>
        )
    }} />
};

export default DeleteAppDialog;