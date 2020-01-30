import React, { Fragment, useState } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './UpdatePassword.module.scss';
import axios from '../../axios';
import { setAlert } from '../../store/actions/alert';

import TopBar from '../UI/TopBar/TopBar';
import Input from '../UI/Input/Input';
import Button from '../UI/Button/Button';
import Spinner from '../UI/Spinner/Spinner';



const UpdateProfile = ({ auth, setAlert, history }) => {
    const [formData, setFormData] = useState({
        curPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const { curPassword, newPassword, confirmPassword } = formData;

    if (!auth.isAuthenticated) return <Spinner style={{ margin: "2rem" }} />;

    const onChange = (e) => {
        e.preventDefault();
        e.persist()
        setFormData(() => ({
            ...formData,
            [e.target.name]: e.target.value
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return setAlert('New Password does not match Comfirm Password');
        };
        try {
            await axios.put('/api/user/password', { curPassword, newPassword });
            setAlert("Password Updated", "success");
            history.push('/mypage');
        } catch (err) {
            setAlert(err.response.data.message, "danger");
        }



    };


    return (
        <Fragment>
            <TopBar />
            <form onSubmit={e => onSubmit(e)} className={styles.form}>

                <label>Current Password</label>
                <Input
                    type="password"
                    placeholder="Current Password"
                    name="curPassword"
                    value={curPassword}
                    onChange={e => onChange(e)}
                    required
                />
                <label>New Password</label>
                <Input
                    type="password"
                    placeholder="New Password"
                    name="newPassword"
                    value={newPassword}
                    onChange={e => onChange(e)}
                    required
                />
                <label>Confirm New Password</label>
                <Input
                    type="password"
                    placeholder="Confirm new password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={e => onChange(e)}
                    required
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
    setAlert: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth,
});

export default connect(mapStateToProps, { setAlert })(UpdateProfile);
