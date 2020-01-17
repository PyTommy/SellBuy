import React from 'react';
import { Link } from 'react-router-dom';

import classes from './Message.module.scss';

const message = ({
    conversation: {
        counterParty,
        message
    }
}) => {
    return (
        <Link className={classes.Link} to={`/messages/${counterParty._id}`}>
            <div className={classes.Message}>
                <img className={classes.Image} src={require("../../../assets/default.png")} alt="profile_picture" />
                <p className={classes.Name}>{counterParty.name}</p>
                <p className={classes.Time}>{message.createdAt}</p>
                <p className={classes.Text}>{message.text}</p>
            </div>
        </Link>
    );
};

export default message;