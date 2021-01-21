import React, { forwardRef, useState, useEffect } from 'react';
import ToolTip from '@material-ui/core/Tooltip';

const TruncatedToolTip = forwardRef((props, childRef) => {
    const [shouldToolTip, setShouldToolTip] = useState(false);

    const compareSize = () => {
        if(!childRef.current) return;
        const isTruncated = childRef.current.scrollWidth > childRef.current.offsetWidth;
        setShouldToolTip(isTruncated);
    };

    useEffect(() => {
        compareSize();
        window.addEventListener('resize', compareSize);

        return () => window.removeEventListener('resize', compareSize);
    }, []);

    return (
        <ToolTip title={props.label ?? ""} placement={props.placement ?? "bottom"} disableHoverListener={!shouldToolTip}>
            {props.children}
        </ToolTip>
    );
});

export default TruncatedToolTip;