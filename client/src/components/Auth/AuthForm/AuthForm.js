import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import styles from './AuthForm.module.scss';

// Actions
import { setAlert } from '../../../actions/alert';
import { register, login } from '../../../actions/auth';

// Components
import Input from '../../UI/Input/Input';
import Button from '../../UI/Button/Button';


const AuthForm = ({
    isSignup,
    // Actions
    setAlert,
    register,
    login
}) => {
    // State
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password2: ""
    });

    useEffect((prevState) => {
        setFormData(() => ({
            name: "",
            email: "",
            password: "",
            password2: "",
        }));
    }, [isSignup]);


    const onChange = (e) => {
        e.preventDefault();
        e.persist();

        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };


    const onSubmit = (e) => {
        e.preventDefault();
        const { name, email, password, password2 } = formData;

        if (isSignup) { // SignUp
            if (password !== password2) {
                setAlert("password do not much", "danger");
            } else {
                register({ name, email, password });
            }
        } else { // Login
            login({ email, password });
        }
    }

    return (
        <form onSubmit={onSubmit} className={styles.AuthForm}>
            {isSignup && (
                <Input
                    type="text"
                    placeholder="Username"
                    value={formData.name}
                    onChange={e => onChange(e)}
                    name="name"
                    required
                />
            )}
            <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={onChange}
                name="email"
                required
            />
            <Input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={onChange}
                name="password"
                required
            />
            {isSignup &&
                <Input
                    type="password"
                    placeholder="Comfirm Password"
                    value={formData.password2}
                    onChange={onChange}
                    name="password2"
                    required
                />
            }
            <Button btnType="color-primary">{isSignup ? "Signup" : "Login"}</Button>
        </form>
    )
}

AuthForm.propTypes = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
}

export default connect(null, {setAlert, login, register})(AuthForm);
