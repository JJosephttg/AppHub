import React, { useEffect, useState } from 'react';

import CategoryAppListing from './CategoryAppListing';

import styles from './CategoryListing.module.css';

const { ipcRenderer } = window.require('electron');

const CategoryListing = props => {
    const [favoritesList, setFavorites] = useState([]);
    useEffect(() => {
        //Load in favorites
        if(props.inputActionHandler) props.inputActionHandler({
            addHandler: () => {},
            searchHandler: () => {}
        });

        ipcRenderer.invoke("DBUtility-GetFavorites").then(
            data => setFavorites(prevData => [...prevData, ...data.result])
        );
    }, []);

    return (
        <div className={styles["page-root"]}>
            <CategoryAppListing categoryName="Favorites" appList={favoritesList} />
        </div>
    );
}


export default CategoryListing;