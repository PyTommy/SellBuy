import React, { Fragment } from 'react';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types'
import imageConverter from '../../../utils/imageConverter';
import styles from './User.module.scss';
import { AiOutlineMessage } from 'react-icons/ai';
import { IoLogoFacebook } from 'react-icons/io';

const User = ({ user, match }) => {

    let avatarSrc;
    if (user) {
        avatarSrc = user.avatar
            ? imageConverter(user.avatar.data)
            : imageConverter(null);
    }

    return (
        <Fragment>

            <img
                src={avatarSrc}
                alt="Profile"
                className={styles.profileImage} />
            <h2>{user.name}</h2>
            <div className={styles.icons}>
                <Link to={`/messages/${match.params.id}`}>
                    <AiOutlineMessage
                        size={"4rem"}
                    />
                </Link>
                {user.facebook &&
                    <a target="_blank" style={{ marginLeft: "1rem" }} href={user.facebook}>
                        <IoLogoFacebook
                            size={"4rem"}
                            color={"#0084ff"}
                        />
                    </a>
                }
            </div>
        </Fragment>
    )
}

User.propTypes = {
    user: PropTypes.object.isRequired,
}

export default withRouter(User)
