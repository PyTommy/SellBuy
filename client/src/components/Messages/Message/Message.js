import React from 'react';

import classes from './Message.module.scss';

const message = props => {
    return (
        <div className={classes.Message}>
            <img className={classes.Image} src={require("../../../assets/profile-pic.JPG")} alt="profile_picture" />
            <p className={classes.Name}>Avex</p>
            <p className={classes.Time}>1 day ago</p>
            <p className={classes.Text}>Thank you for buying our event ticket. If you have any question, feel free to contact us.</p>
        </div>
    );
};

export default message;