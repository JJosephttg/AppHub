import React from 'react';
import { Link } from 'react-router-dom';

import styles from './ListingToolBar.module.css';

const ListingToolBar = props => {
    return (
        <div className={styles["toolbar-container"]}>  
            <div className={[styles["left-container"], styles.container].join(" ")}>
                <div className={styles["logo-container"]}>
                    <Link to="/">
                        <svg height="2rem" width="2rem" viewBox="0 0 16 16" className="bi bi-box-seam" fill="white" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2l-2.218-.887zm3.564 1.426L5.596 5 8 5.961 14.154 3.5l-2.404-.961zm3.25 1.7l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z"/>
                        </svg>
                    </Link>
                </div>
                
                <h1 className={styles["page-title"]}>Categories</h1>
            </div>
            <div className={[styles["right-container"], styles.container].join(" ")}>
                <div className={styles["search-logo"]}>
                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-search" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z"/>
                        <path fillRule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
                    </svg>
                </div>
                <input className={styles["search-input"]} type="text" placeholder="Search..."/>
            </div>            
        </div>
    );
}

export default ListingToolBar;