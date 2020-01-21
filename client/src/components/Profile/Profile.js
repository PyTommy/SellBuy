import React, { Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import styles from './Profile.module.scss'
import { getProfile } from '../../actions/profile';
import imageConverter from '../../utils/imageConverter';

// import { IoLogoFacebook } from 'react-icons/io';
import { AiOutlineMessage } from 'react-icons/ai';
import TopBar from '../UI/TopBar/TopBar';
import Spinner from '../UI/Spinner/Spinner';

const Profile = ({
    history,
    match,
    profile,
    getProfile
}) => {
    useEffect(() => {
        getProfile(match.params.id);
    }, [getProfile]);

    let avatarSrc;
    if (profile.user) {
        avatarSrc = profile.user.avatar
            ? imageConverter(profile.user.avatar.data)
            : imageConverter(null);
    }

    let content = <p>User not found</p>;
    if (profile.loading.user) content = <Spinner style={{ marginTop: "5rem" }} />;
    if (!profile.loading.user && profile.user) {
        content =
            <Fragment>
                <img
                    src={avatarSrc}
                    className={styles.profileImage} />
                <h2>{profile.user.name}</h2>
                <div className={styles.icons}>
                    <Link to={`/messages/${match.params.id}`}>
                        <AiOutlineMessage
                            size={"4rem"}
                        />
                    </Link>
                    {/* <a target="_blank" href="https://www.facebook.com/profile.php?id=100009155066626">
                            <IoLogoFacebook
                                size={"4rem"}
                                color={"#0084ff"}
                            />
                        </a> */}
                </div>
                <div className={styles.hr}></div>
            </Fragment>;
    };

    return (
        <Fragment>
            <TopBar goBack={() => history.goBack()} />
            <div className={styles.Profile}>
                {content}
            </div>
        </Fragment>
    )
}

Profile.propTypes = {
    profile: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    profile: state.profile,
});

export default connect(mapStateToProps, { getProfile })(Profile);
