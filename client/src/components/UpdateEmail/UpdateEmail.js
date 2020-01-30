import React, { Fragment, useEffect, useState } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { updateEmail } from '../../store/actions/auth';
import styles from './UpdateEmail.module.scss';

import TopBar from '../UI/TopBar/TopBar';
import Input from '../UI/Input/Input';
import Button from '../UI/Button/Button';
import Spinner from '../UI/Spinner/Spinner';



const UpdateProfile = ({ auth, updateEmail, history }) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setFormData((prevState) => ({
            ...prevState,
            email: auth.user ? auth.user.email : "",
        }));
    }, [auth.user, setFormData]);

    if (!auth.isAuthenticated) return <Spinner style={{ margin: "2rem" }} />;

    const onChange = (e) => {
        e.preventDefault();
        e.persist()
        setFormData(() => ({
            ...formData,
            [e.target.name]: e.target.value
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (loading) return null;
        setLoading(true);
        updateEmail(formData, () => history.push('/mypage'), () => setLoading(false));
    };

    return (
        <Fragment>
            <TopBar />
            <form onSubmit={e => onSubmit(e)} className={styles.form}>
                <label>Email</label>
                <Input
                    type="email"
                    placeholder="Your email"
                    name="email"
                    value={formData.email}
                    onChange={e => onChange(e)}
                    required
                />
                <label>Current Password</label>
                <Input
                    type="password"
                    placeholder="Current Password"
                    name="password"
                    value={formData.password}
                    onChange={e => onChange(e)}
                    required
                />
                <Button btnType="color-primary size-lg" loading={loading}>
                    Update
                </Button>
            </form>
        </Fragment >
    )
}

UpdateProfile.propTypes = {
    auth: PropTypes.object.isRequired,
    updateEmail: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth,
});

export default connect(mapStateToProps, { updateEmail })(UpdateProfile);
