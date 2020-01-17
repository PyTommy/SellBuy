import React from 'react'
import styles from './Comment.module.scss';
import PictureRadius from '../../../UI/Pictures/PictureRadius/PictureRadius';
import imageConverter from '../../../../utils/imageConverter';
import uuid from 'uuid/v4';

const Comment = ({ comment }) => {
    let avatar;
    if (comment.avatar) {
        avatar = `data:image/jpeg;base64,${imageConverter(comment.avatar.data)}`;
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
                {
                    comment.text.split("\n").map((line) => {
                        return <p key={uuid()}>{line}</p>
                    })
                }
            </div>
        </div>
    )
}

export default Comment;
