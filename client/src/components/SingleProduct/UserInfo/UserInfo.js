import React from 'react'
// import PropTypes from 'prop-types'
import imageConverter from '../../../utils/imageConverter';
import styles from './UserInfo.module.scss';

import PictureRadius from '../../UI/Pictures/PictureRadius/PictureRadius';


const UserInfo = ({name, avatar}) => {
    const avatarSrc = avatar
        ? `data:image/jpeg;base64,${imageConverter(avatar.data)}`
        : require("../../../assets/default.png");

    return (
        <div className={styles.User}>
            <div className={styles.UserName}>{name}</div>
            <PictureRadius
                alt="Profile Picture"
                src={avatarSrc}
                size="3rem"
                className={styles.UserPicture}
            />
        </div>
    )
}

// UserInfo.propTypes = {

// }

export default UserInfo
