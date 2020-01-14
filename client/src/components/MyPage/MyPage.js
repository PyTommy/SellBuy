import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import styles from './MyPage.module.scss';

// components
import Spinner from '../UI/Spinner/Spinner';
import DisplayProfile from './DisplayProfile/DisplayProfile';
import Logout from './Logout/Logout';


const MyPage = ({
    auth
}) => {    
    if (auth.loading) {
        return <Spinner size={100}/>;
    }

    return (
        <div className={styles.mypage}>
            <DisplayProfile />
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