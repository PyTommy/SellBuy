import React from 'react'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import styles from './DisplayProfile.module.scss'
import imageConverter from '../../../utils/imageConverter';

// Components
import PictureRadius from '../../UI/Pictures/PictureRadius/PictureRadius';

const DisplayProfile = ({
    history,
    user: {
        avatar,
        name
    }
}) => {
    const avatarSrc = avatar
        ? imageConverter(avatar.data)
        : imageConverter(null);

    const profileClickedHandler = () => history.push('mypage/avatar');

    return (
        <div className={styles.DisplayProfile}>
            <div>{name}</div>
            <PictureRadius
                onClick={profileClickedHandler}
                src={avatarSrc}
                size="5rem" />
        </div>
    )
}

DisplayProfile.propTypes = {
    user: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    user: state.auth.user
});

export default connect(mapStateToProps)(withRouter(DisplayProfile));
