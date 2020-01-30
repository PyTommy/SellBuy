import React, { Fragment, useEffect, useState } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { updateProfile } from '../../store/actions/auth';
import styles from './UpdateProfile.module.scss';

import TopBar from '../UI/TopBar/TopBar';
import Input from '../UI/Input/Input';
import Button from '../UI/Button/Button';
import Spinner from '../UI/Spinner/Spinner';



const UpdateProfile = ({ auth, updateProfile, history }) => {
    const [formData, setFormData] = useState({
        name: "",
        facebook: "",
    });

    useEffect(() => {
        setFormData(() => ({
            name: auth.user ? auth.user.name : "",
            facebook: auth.user && auth.user.facebook ? auth.user.facebook : "",
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
        updateProfile(formData);
        history.push('/mypage');
    };


    return (
        <Fragment>
            <TopBar />
            <form onSubmit={e => onSubmit(e)} className={styles.form}>
                <label>Username</label>
                <Input
                    type="name"
                    placeholder="Your name"
                    name="name"
                    value={formData.name}
                    onChange={e => onChange(e)}
                    required
                />
                <label>Facebook URL (Optional)</label>
                <Input
                    type="Facebook"
                    placeholder="Facebook URL (optional)"
                    name="facebook"
                    value={formData.facebook}
                    onChange={e => onChange(e)}
                />
                <Button btnType="color-primary size-lg">
                    Update
                </Button>
            </form>
        </Fragment >
    )
}

UpdateProfile.propTypes = {
    auth: PropTypes.object.isRequired,
    updateProfile: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth,
});

export default connect(mapStateToProps, { updateProfile })(UpdateProfile);
