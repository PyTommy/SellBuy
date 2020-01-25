import React from 'react'
import { Link } from 'react-router-dom';
import styles from './Setting.module.scss'

const Setting = () => {
    return (
        <div className={styles.Setting}>
            <h3>Setting</h3>
            <ul className={styles.links}>
                <Link className={styles.Link} to="/mypage/update/profile">Update Profile</Link>
                <Link className={styles.Link} to="/mypage/update/avatar">Update Profile Image</Link>
                <Link className={styles.Link} to="/mypage/update/email">Change Email</Link>
                <Link className={styles.Link} to="/mypage/update/password">Change Password</Link>
            </ul>
        </div>
    )
}

export default Setting
