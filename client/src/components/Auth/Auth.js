import React, { useState, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './Auth.module.scss';

// Components
import Spinner from '../UI/Spinner/Spinner';
import AuthFrom from './AuthForm/AuthForm';
import FormTypeChanger from './FormTypeChanger/FormTypeChanger';


const Auth = ({ auth: { isAuthenticated } }) => {
    const [isSignup, setIsSignup] = useState(true);


    const onChangeFormType = (boolean) => {
        boolean !== isSignup && setIsSignup(boolean)
    }

    // Redirect authenticated user
    if (isAuthenticated) {
        return <Redirect to="/" />;
    };

    const form = (
        <Fragment>
            <FormTypeChanger isSignup={isSignup} onChangeFormType={onChangeFormType} />
            <AuthFrom isSignup={isSignup} />
        </Fragment>
    );

    return (
        <div className={styles.Auth}>
            {form}
        </div>
    );
};

Auth.propTypes = {
    auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default connect(mapStateToProps, null)(Auth);