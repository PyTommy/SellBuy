import React, { useEffect, Fragment, useState } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getMessage, sendMessage } from '../../store/actions/message'

import styles from './MessageBox.module.scss';
import Spinner from '../UI/Spinner/Spinner';
import TopBar from './TopBar/TopBar';
import Message from './Message/Message';
import ReplyForm from './ReplyForm/ReplyForm';

const MessageBox = ({
    match,
    history,
    message,
    getMessage,
    sendMessage
}) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getMessage(match.params.id, () => setLoading(false));
    }, [getMessage, match.params.id]);

    const onSubmitHandler = (text) => {
        sendMessage(message.sender._id, text);
        history.goBack();
    };

    const amIRecipient = match.path === "/inbox/recieved/:id"
        ? true
        : false;

    let counterParty = {};
    if (message) {
        if (amIRecipient) {
            counterParty = message.sender;
            counterParty.name = message.senderName;
        } else {
            if (message.recipient.avatar) { // avoiding cases that recipient has not populated yet
                counterParty = message.recipient;
            }
            counterParty.name = message.senderName;
        }
    }

    let content = <p>Not found</p>;
    if (!message && loading.getMessage) {
        content = <Spinner style={{ marginTop: "8rem" }} />
    }
    if (message) {
        content = (
            <Fragment>
                <Message message={message} counterParty={counterParty} amIRecipient={amIRecipient} />
                {amIRecipient &&
                    <ReplyForm
                        onSubmitHandler={onSubmitHandler}
                        loading={loading.sendMessage}
                    />
                }
            </Fragment>
        );
    }

    return (
        <div>
            <TopBar
                counterParty={counterParty}
            />
            <div className={styles.MessageBoxMain}>
                {content}
            </div>
        </div>
    )
}

MessageBox.propTypes = {
    message: PropTypes.object,
    getMessage: PropTypes.func.isRequired,
    sendMessage: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    message: state.message.message,
});

export default connect(mapStateToProps, { getMessage, sendMessage })(MessageBox);
