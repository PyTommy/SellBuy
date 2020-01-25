import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './MyPage.module.scss';

// components
import Spinner from '../UI/Spinner/Spinner';
import DisplayProfile from './DisplayProfile/DisplayProfile';
import Logout from './Logout/Logout';
import Setting from './Setting/Setting';


const MyPage = ({
    auth
}) => {
    if (auth.loading) {
        return <Spinner size={100} />;
    }

    return (
        <div className={styles.mypage}>
            <DisplayProfile />
            <div className={styles.hr}></div>
            <Setting />
            <div className={styles.hr}></div>
            <Logout />
        </div>
    );
};

MyPage.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, null)(MyPage);