import React, { Fragment } from 'react'
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types'
import imageConverter from '../../../utils/imageConverter';
import styles from './UserInfo.module.scss';

import PictureRadius from '../Pictures/PictureRadius/PictureRadius';


const UserInfo = ({
    title = null,
    name,
    avatar,
    userId,
    history,

    // styles
    imageSize = "3rem",
    imageLeft = true,
    fontSize = "1.4rem",
    color = "inherit",
    fontWeight = "bold",
    marginBetween = "1.5rem",
    style
}) => {
    const avatarSrc = avatar
        ? imageConverter(avatar.data)
        : imageConverter(null);

    const marginForName = imageLeft ? { marginLeft: marginBetween } : { marginRight: marginBetween };
    const picture = <PictureRadius
        alt="Profile Picture"
        src={avatarSrc}
        size={imageSize}
        className={styles.UserPicture}
    />;
    const nameDiv =
        <div
            style={{
                ...marginForName,
                fontSize,
                fontWeight,
                color
            }}
        >{title && <span style={{ fontWeight: "normal" }}>{`${title} `}</span>}{name}
        </div>;

    return (
        <div className={[styles.User, style].join(" ")} onClick={userId ? () => history.push(`/profile/${userId}`) : () => null}>
            {
                imageLeft
                    ? <Fragment>{picture}{nameDiv}</Fragment>
                    : <Fragment>{nameDiv}{picture}</Fragment>
            }
        </div>
    )
}

UserInfo.propTypes = {
    name: PropTypes.string,
    userId: PropTypes.string,

    // styles
    imageSize: PropTypes.string,
    imageLeft: PropTypes.bool,
    fontSize: PropTypes.string,
    color: PropTypes.string,
    fontWeight: PropTypes.string,
    marginBetween: PropTypes.string
};

export default withRouter(UserInfo);
