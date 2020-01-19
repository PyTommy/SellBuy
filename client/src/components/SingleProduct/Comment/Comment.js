import React from 'react'
import styles from './Comment.module.scss';
import TextToJSX from '../../UI/TextToJSX/TextToJSX';
import UserInfo from '../../UI/UserInfo/UserInfo'

const Comment = ({ comment }) => {
    return (
        <div className={styles.Comment}>
            <UserInfo name={comment.name} avatar={comment.avatar} userId={comment.user} />
            <div className={styles.Text}>
                <TextToJSX>{comment.text}</TextToJSX>
            </div>
        </div>
    )
}

export default Comment;
