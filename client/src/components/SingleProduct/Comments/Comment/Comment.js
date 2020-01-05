import React from 'react'
import styles from './Comment.module.scss';
import PictureRadius from '../../../UI/Pictures/PictureRadius/PictureRadius';
import imageConverter from '../../../../utils/imageConverter';

const Comment = ({comment}) => {
    let avatar;
    if (comment.avatar) {
        avatar = `data:image/jpg;base64,${imageConverter(comment.avatar.data)}`;
    } else {
        avatar = require("../../../../assets/default.png");
    }
    return (
        <div className={styles.Comment}>
            <div className={styles.User}>
                <PictureRadius
                    alt="UserProfile"
                    src={avatar}
                    size="3rem"
                    className={styles.UserPicture}
                    />
                <div>{comment.name}</div>
            </div>
            <div className={styles.Text}>
                {comment.text}
            </div>
        </div>
    )
}

export default Comment;
