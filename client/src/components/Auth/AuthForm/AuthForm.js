import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './AuthForm.module.scss';
import Spinner from '../../UI/Spinner/Spinner'

// Actions
import { setAlert } from '../../../store/actions/alert';
import { register, login } from '../../../store/actions/auth';

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
    const [loading, setLoading] = useState(false);
    // State
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password2: ""
    });

    useEffect(() => {
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

        const failCB = () => { setLoading(false) };
        setLoading(true);

        // SignUp
        if (isSignup) {
            if (password !== password2) return setAlert("password do not much", "danger", failCB);
            register({ name, email, password }, failCB);
        } else {
            login({ email, password }, failCB);
        }
    }
    if (loading) return <Spinner style={{ margin: "2rem" }} />;

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

export default connect(null, { setAlert, login, register })(AuthForm);
