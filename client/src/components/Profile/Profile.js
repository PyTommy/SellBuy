import React, { Fragment, useEffect, useState } from 'react'
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
    // actions
    getProfile,
}) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user || user._id.toString() !== match.params.id) {
            setLoading(true);
            getProfile(match.params.id, () => { setLoading(false) });
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
}

const mapStateToProps = state => ({
    user: state.profile.user,
});

export default connect(mapStateToProps, { getProfile })(Profile);
