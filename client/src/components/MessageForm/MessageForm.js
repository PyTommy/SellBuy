import React, { useState, useEffect, Fragment } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import Input from '../UI/Input/Input';
import { sendMessage } from '../../store/actions/message';
import { getProfile } from '../../store/actions/profile';
import UserInfo from '../UI/UserInfo/UserInfo';
import UITopBar from '../UI/TopBar/TopBar';

const MessageForm = ({ profile, match, sendMessage, getProfile }) => {
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!profile.user || profile.user._id.toString() !== match.params.id) {
            getProfile(match.params.id);
        };
    }, [profile.user, match.params.id, getProfile]);

    const onSubmitHandler = (e) => {
        e.preventDefault();
        sendMessage(match.params.id, message);
    };

    return (
        <Fragment>
            <UITopBar>
                {(profile.user && profile.user._id.toString() === match.params.id) &&
                    <UserInfo
                        name={profile.user.name}
                        avatar={profile.user.avatar}
                        userId={profile.user._id}
                        font-size="1.5rem"
                    />
                }
            </UITopBar>
            <form onSubmit={onSubmitHandler} style={{ marginTop: "5.5rem" }}>
                <Input
                    type="textarea"
                    placeholder="Message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required={true}
                />
                <button>Send</button>
            </form>
        </Fragment>
    )
}

MessageForm.propTypes = {
    sendMessage: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    profile: state.profile
});

export default connect(mapStateToProps, { sendMessage, getProfile })(MessageForm);