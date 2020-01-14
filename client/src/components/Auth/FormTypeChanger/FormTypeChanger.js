import React from 'react';
import PropTypes from 'prop-types';
import styles from './FormTypeChanger.module.scss';

const FormTypeChanger = ({isSignup, onChangeFormType}) => {

    // Default style
    const signupButtonClass = [styles.onSignupChange];
    const loginButtonClass = [styles.onLoginChange];
    
    // Add active style
    if (isSignup) {
        signupButtonClass.push(styles.active);
    } else {
        loginButtonClass.push(styles.active);
    }

    return (
        <div>
            <button
                className={signupButtonClass.join(" ")}
                onClick={() => onChangeFormType(true)}
                >Signup
            </button>
            <button
                className={loginButtonClass.join(" ")}
                onClick={() => onChangeFormType(false)}
                >Login
            </button>
        </div>
    )
}

FormTypeChanger.propTypes = {
    isSignup: PropTypes.bool.isRequired
};

export default FormTypeChanger;
