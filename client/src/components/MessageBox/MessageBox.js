import React, { useEffect, Fragment } from 'react'
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
    loading,
    getMessage,
    sendMessage
}) => {
    useEffect(() => {
        getMessage(match.params.id);
    }, [getMessage, match.params.id]);

    const onSubmitHandler = (text) => {
        sendMessage(message.sender._id, text);
        history.goBack();
    };

    const amIRecipient = match.path === "/inbox/recieved/:id"
        ? true
        : false;

    let counterParty = null;
    if (message) {
        if (amIRecipient) {
            counterParty = message.sender;
            counterParty.name = message.senderName;
        } else {
            counterParty = message.recipient;
            counterParty.name = message.recipientName;
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
    loading: PropTypes.object.isRequired,
    getMessage: PropTypes.func.isRequired,
    sendMessage: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    message: state.message.message,
    loading: state.message.loading,
});

export default connect(mapStateToProps, { getMessage, sendMessage })(MessageBox);
