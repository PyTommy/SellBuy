import React, { Fragment, useEffect } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import styles from './Profile.module.scss'
// action
import { getProfile } from '../../store/actions/profile';
// Components
import TopBar from '../UI/TopBar/TopBar';
import Spinner from '../UI/Spinner/Spinner';
import User from './User/User';
import Products from './Products/Products';

const Profile = ({
    history,
    match,
    //store
    user,
    loading,
    // actions
    getProfile,
}) => {
    useEffect(() => {
        if (!user || user._id.toString() !== match.params.id) {
            getProfile(match.params.id);
        }
    }, [getProfile, user, match.params.id]);

    let content = <p>User not found</p>;
    if (loading) content = <Spinner style={{ marginTop: "5rem" }} />;
    if (!loading && user) {
        content =
            <Fragment>
                <User user={user} />
                <div className={styles.hr}></div>
                <Products />
            </Fragment>
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
    getProfile: PropTypes.func.isRequired,
    user: PropTypes.object,
    loading: PropTypes.bool.isRequired,
}

const mapStateToProps = state => ({
    user: state.profile.user,
    loading: state.profile.loading.user,
});

export default connect(mapStateToProps, { getProfile })(Profile);
