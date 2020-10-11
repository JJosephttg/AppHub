import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ToolTip from '@material-ui/core/Tooltip'

import styles from './ListingToolBar.module.css';

const ListingToolBar = props => {
    const [ shouldToolTip, setShouldToolTip] = useState(false);
    const textElementRef = useRef();

    const compareSize = () => {
        const isTruncated = textElementRef.current.scrollWidth > textElementRef.current.clientWidth;
        setShouldToolTip(isTruncated);
    };

    useEffect(() => {
        compareSize();
        window.addEventListener('resize', compareSize);

        return () => window.removeEventListener('resize', compareSize);
    }, []);

    const isSearchHidden = props.inputActions?.searchHandler == null;
    const isAddHidden = props.inputActions?.addHandler == null;

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
                <ToolTip title="Categories" placement="bottom" disableHoverListener={!shouldToolTip}>
                    <h1 ref={textElementRef} className={styles["page-title"]}>Categories</h1>
                </ToolTip>
            </div>
             
            { isSearchHidden ? null : (
                <div className={[styles["middle-container"], styles.container].join(" ")}>  
                    <input className={styles["search-input"]} type="text" placeholder="Search..."/>
                    <div className={styles["search-logo"]}>
                        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-search" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z"/>
                            <path fillRule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
                        </svg>
                    </div>
                </div>
            )}
            
            <div className={[styles["right-container"], styles.container].join(" ")}>
                {isAddHidden ? null : <button className={["btn btn-primary", styles.iconSizeFont].join(" ")}>+</button>}
            </div>            
        </div>
    );
}

export default ListingToolBar;
/*
<button className={["btn btn-secondary", styles.iconSizeFont].join(" ")}>
                <svg width=".7em" height=".7em" viewBox="0 0 16 16" className="bi bi-pencil" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                </svg>
                </button>
                <button className={["btn btn-danger", styles.iconSizeFont].join(" ")}>
                    <svg width=".7em" height=".7em" viewBox="0 0 16 16" className="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>
                </button>
*/