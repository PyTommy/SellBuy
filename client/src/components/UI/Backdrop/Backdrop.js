import React from 'react';

import classes from './Backdrop.css';

const backdrop = (props) => {
    return props.show? 
        <div 
            className={[classes.Backdrop,classes.Open].join(" ")} onClick={props.clicked}
            >{props.children}
        </div>
        : 
        <div 
            className={classes.Backdrop} 
            onClick={props.clicked}
            >
        </div>;
};

export default backdrop;