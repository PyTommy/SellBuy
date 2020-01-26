import React from 'react';
import { Link } from 'react-router-dom';
import parse from 'html-react-parser';
import imageConverter from '../../../utils/imageConverter';
import ago from '../../../utils/ago';

import classes from './Notification.module.scss';

const Notification = ({
    notification: {
        trigger,
        innerHTML,
        product,
        createdAt
    }
}) => {
    let avatarSrc = trigger.avatar
        ? imageConverter(trigger.avatar.data)
        : imageConverter(null);
    return (
        <Link className={classes.Link} to={`/products/${product}`}>
            <div className={classes.Notification}>
                <img className={classes.Image} src={avatarSrc} alt="profile_picture" />
                <div className={classes.rightContainer}>
                    <p className={classes.Text}>{parse(innerHTML)}</p>
                    <p className={classes.Time}>{`${ago(createdAt)} ago`}</p>
                </div>
            </div>
        </Link>
    );
};

export default Notification;