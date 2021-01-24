import React, { useEffect, useState, useContext, Fragment } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

import { MainAppContext } from '../MainAppController/MainAppController';
import AppItemSettings from '../Dialogs/AppItemSettings/AppItemSettings';
import AppListing from '../../Components/AppListing/AppListing';

import listStyles from './Listing.module.css';

const { ipcRenderer } = window.require('electron');

const CategoryListingScreen = props => {
    const mainAppContext = useContext(MainAppContext);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [favoritesList, setFavorites] = useState([]);
    const [categoryData, setCategoryData] = useState({});
    const [uncategorizedList, setUncategorizedList] = useState([]);
    
    const updateListing = _ => {
        //TODO: Update each category app listing
        // Load max of 10-20 apps per category

        //Load in favorites
        setIsLoadingData(true);
        Promise.all([
            ipcRenderer.invoke("DBUtility-GetFavorites", 10), 
            ipcRenderer.invoke("DBUtility-GetCategoryPreviews", 10),
            ipcRenderer.invoke("DBUtility-GetApps", null, 10)
        ]).then(
            data => {
                //Deal with favorites
                if(!data[0].error) setFavorites([...data[0].result]);
                if(!data[1].error) {
                    let results = data[1].result.reduce((map, app) => {
                        map[app.CategoryName] = (map[app.CategoryName] || []).concat(app);
                        return map;
                    }, {});
                    setCategoryData(results);
                }
                if(!data[2].error) setUncategorizedList([...data[2].result]);
                setIsLoadingData(false);
            }
        );
    }

    useEffect(() => {
        mainAppContext.setToolbarActions({
            addHandler: () => mainAppContext.openMainDialog(
                props => <AppItemSettings {...{...props, onSave: updateListing, close: mainAppContext.closeMainDialog}} />),
            searchHandler: () => {}
        });
        mainAppContext.setPageTitle("Categories");
    }, [mainAppContext]);
    
    useEffect(updateListing, []);

    return (
        <Fragment>
            {isLoadingData ? 
                <div className={listStyles["spinner-wrapper"]}>
                    <CircularProgress size={30} className={listStyles["spinner"]} />
                </div> : 
                <Fragment>
                    {favoritesList ? <AppListing onDeleteItem={updateListing} displayName="Favorites" listingLink="/favorites" appList={favoritesList} /> : null}
                    {categoryData ? Object.keys(categoryData).map((category) => 
                        <AppListing onDeleteItem={updateListing} key={category} displayName={category} appList={categoryData[category]} listingLink={`/apps/${encodeURIComponent(category)}`} />
                    ) : null }
                    {uncategorizedList ? <AppListing onDeleteItem={updateListing} displayName="Other Apps" appList={uncategorizedList} listingLink="/uncategorized" /> : null}
                </Fragment>
            } 
        </Fragment>
    );
}


export default CategoryListingScreen;