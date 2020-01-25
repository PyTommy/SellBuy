import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { clearRecievedMessages, clearSentMessages, getRecieved, getSent } from '../../store/actions/message';
import Switcher from '../UI/Switcher/Switcher';

import styles from './Inbox.module.scss';
import Message from './Message/Message';
import Scroller from '../UI/Scroller/Scroller';

const Inbox
    = ({
        history,
        match,
        auth,
        message: {
            recieved,
            sent,
        },
        clearRecievedMessages,
        clearSentMessages,
        getRecieved,
        getSent,
    }) => {
        const checkRecieved = match.params.status === "recieved" ? true : false;

        const buttons = [
            {
                text: "Recieved",
                active: checkRecieved,
                onClickHandler: () => !checkRecieved && history.push('/inbox/recieved')
            },
            {
                text: "Sent",
                active: !checkRecieved,
                onClickHandler: () => checkRecieved && history.push('/inbox/sent')
            }
        ];

        let items;
        if (checkRecieved) {
            items = recieved.messages.map((msg) => {
                return (
                    <Message
                        key={msg._id}
                        name={msg.senderName}
                        messageId={msg._id}
                        text={msg.text}
                        createdAt={msg.createdAt}
                        avatar={msg.sender.avatar}
                        partialPath='recieved'
                        checkRecieved={checkRecieved}
                    />
                );
            })
        } else {
            items = sent.messages.map((msg) => {
                return (
                    <Message
                        key={msg._id}
                        name={msg.recipientName}
                        messageId={msg._id}
                        text={msg.text}
                        avatar={msg.recipient.avatar}
                        createdAt={msg.createdAt}
                        partialPath='sent'
                        checkRecieved={checkRecieved}
                    />
                );
            })
        }

        const noMsg = <p style={{ height: "75vh" }}>No recieved message yet</p>;

        let getMessages = () => null,
            refreshMessages = () => null;
        if (auth.isAuthenticated && checkRecieved && !recieved.loading) {
            getMessages = () => getRecieved(recieved.messages.length);
            refreshMessages = () => clearRecievedMessages();
        }
        if (auth.isAuthenticated && !checkRecieved && !sent.loading) {
            getMessages = () => getSent(sent.messages.length);
            refreshMessages = () => clearSentMessages();
        }

        const hasMore = checkRecieved ? recieved.hasMore : sent.hasMore;

        return (
            <div>
                <Switcher
                    items={buttons}
                />
                <Scroller
                    onRefreshFunc={refreshMessages}
                    loadMoreFunc={getMessages}
                    hasMore={hasMore}
                >
                    <ul className={styles.messages}>
                        {!hasMore && items.length === 0 ? noMsg : items}
                    </ul>
                </Scroller>
            </div>
        );
    };

Inbox.propTypes = {
    message: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    clearRecievedMessages: PropTypes.func.isRequired,
    clearSentMessages: PropTypes.func.isRequired,
    getRecieved: PropTypes.func.isRequired,
    getSent: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    message: state.message,
    auth: state.auth,
});

export default connect(mapStateToProps, { clearRecievedMessages, clearSentMessages, getRecieved, getSent })(Inbox
);