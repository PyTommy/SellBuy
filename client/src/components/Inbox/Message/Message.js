import React from 'react';
import { Link } from 'react-router-dom';
import imageConverter from '../../../utils/imageConverter';
import textAbstract from '../../../utils/textAbstract';
import ago from '../../../utils/ago';

import classes from './Message.module.scss';

const message = ({
    messageId,
    name,
    createdAt,
    text,
    checkRecieved,
    partialPath,
    avatar,
    seen = true
}) => {
    let avatarSrc = avatar
        ? imageConverter(avatar.data)
        : imageConverter(null);
    return (
        <Link className={classes.Link} to={`/inbox/${partialPath}/${messageId}`}>
            <div className={classes.Message}>
                <img className={classes.Image} src={avatarSrc} alt="profile_picture" />
                <p className={classes.Name}>
                    <span style={{ fontWeight: "normal" }}>
                        {checkRecieved
                            ? "From "
                            : "To "
                        }
                    </span>
                    {name}
                </p>
                <p className={classes.Time}>{`${ago(createdAt)} ago`}</p>
                <p className={classes.Text}>{textAbstract(text, 40)}</p>
                {!seen && <span className={classes.unseen}></span>}
            </div>
        </Link>
    );
};

export default message;