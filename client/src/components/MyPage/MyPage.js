import React, {useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import imageConverter from '../../utils/imageConverter';
import styles from './MyPage.module.scss';

// components
import Button from '../UI/Button/Button';
import PictureRadius from '../UI/Pictures/PictureRadius/PictureRadius';
import Spinner from '../UI/Spinner/Spinner';
import Backdrop from '../UI/Backdrop/Backdrop';

// action creators
import {logout} from '../../actions/auth';


const MyPage = ({
    auth,
    history,
    logout,
}) => {    
    if (!auth.user || auth.loading) {
        return <Spinner size={100}/>;
    }

    let avatar;
    if (auth && auth.user.avatar) {
        avatar = `data:image/jpg;base64,${imageConverter(auth.user.avatar.data)}`;
    } else {
        avatar = require("../../assets/default.png");
    }

    const logoutHandler = () => {
        logout();
        history.push('/');
    };
    const profileClickedHandler = () => {
        history.push('mypage/avatar')
    };
    return (
        <div className={styles.mypage}>
            <div className={styles.header}>
                <div>{auth.user.name}</div>
                <PictureRadius 
                    onClick={profileClickedHandler}
                    src={avatar}
                    size="5rem" />
            </div>
            <Button 
                btnType="border-gray size-lg" 
                onClick={logoutHandler}
                >Logout
            </Button>

        </div>
    );
};

MyPage.propTypes = {
    auth: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, {logout})(MyPage);