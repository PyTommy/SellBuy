import React from 'react'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'
import styles from './Profile.module.scss'
import { IoLogoFacebook } from 'react-icons/io';
import { AiOutlineMessage } from 'react-icons/ai';

const Profile = props => {
    return (
        <div className={styles.Profile}>
            <img
                src={require('../../assets/default.png')}
                className={styles.profileImage} />
            <h2>Hiroki Tominaga</h2>
            <div className={styles.icons}>
                <Link to={`/messages/5e1853fa46adc13cc4b6c181`}>
                    <AiOutlineMessage
                        size={"4rem"}
                    />
                </Link>
                <a target="_blank" href="https://www.facebook.com/profile.php?id=100009155066626">
                    <IoLogoFacebook
                        size={"4rem"}
                        color={"#0084ff"}
                    />
                </a>
            </div>
            <div className={styles.hr}></div>

        </div>
    )
}

Profile.propTypes = {

}

export default Profile
