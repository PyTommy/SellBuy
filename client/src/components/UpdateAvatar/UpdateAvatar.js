import React, { useState, Fragment } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { updateAvatar } from '../../store/actions/auth'
import styles from './UpdateAvatar.module.scss';

import TopBar from '../UI/TopBar/TopBar';
import Button from '../UI/Button/Button';
import Input from '../UI/Input/Input';


const Avatar = ({ updateAvatar, history }) => {
    const [avatarFile, setAvatarFile] = useState("");

    const onSubmit = (e) => {
        e.preventDefault();
        updateAvatar(avatarFile);
        history.push('/mypage');
    };

    return (
        <Fragment>
            <TopBar />
            <form onSubmit={e => onSubmit(e)} className={styles.form}>
                <label>Profile Image</label>
                <input
                    type="file"
                    onChange={e => setAvatarFile(() => e.target.files[0])}
                    required
                />
                <Button btnType="color-primary size-lg">
                    Update
                </Button>
            </form>
        </Fragment>
    )
}

Avatar.propTypes = {
    updateAvatar: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { updateAvatar })(Avatar);
