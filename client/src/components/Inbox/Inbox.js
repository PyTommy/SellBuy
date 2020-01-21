import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getRecieved, getSent } from '../../actions/message';
import Spinner from '../UI/Spinner/Spinner';
import Switcher from '../UI/Switcher/Switcher';

import styles from './Inbox.module.scss';
import Message from './Message/Message';

const Inbox
    = ({
        message: {
            recieved,
            sent,
            loading,
        },
        getRecieved,
        getSent
    }) => {
        const [checkRecieved, setCheckRecieved] = useState(true);

        useEffect(() => {
            if (checkRecieved && !loading.getRecieved && recieved.length === 0) {
                getRecieved();
            } else if (!checkRecieved && !loading.getSent && sent.length === 0) {
                getSent();
            }
        }, []);

        const onStatusChange = (toRecieved) => {
            if (toRecieved && !checkRecieved) {
                setCheckRecieved(true);
                if (!loading.getRecieved && recieved.length === 0) {
                    getRecieved();
                }

            } else if (!toRecieved && checkRecieved) {
                setCheckRecieved(false);
                if (!loading.getSent && sent.length === 0) {
                    getSent();
                }
            } else if (toRecieved) {
                getRecieved();
            } else if (!toRecieved
            ) {
                getSent();
            }
        };

        const buttons = [
            {
                text: "Recieved",
                active: checkRecieved,
                onClickHandler: () => onStatusChange(true)
            },
            {
                text: "Sent",
                active: !checkRecieved,
                onClickHandler: () => onStatusChange(false)
            }
        ];



        const spinner = (checkRecieved && loading.getRecieved) || (!checkRecieved && loading.getSent)
            ? <Spinner />
            : null;
        const noMsg = ((checkRecieved && !loading.getRecieved && recieved.length === 0) || (!checkRecieved && !loading.getSent && sent.length === 0))
            ? <p>No recieved message yet</p>
            : null;

        return (
            <div>
                <Switcher
                    items={buttons}
                />
                <ul className={styles.messages}>
                    {spinner}
                    {noMsg}
                    {checkRecieved ?
                        recieved.map((msg) => {
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
                        :
                        sent.map((msg) => {
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
                </ul>
            </div>
        );
    };

const mapStateToProps = state => ({
    message: state.message
});

export default connect(mapStateToProps, { getRecieved, getSent })(Inbox
);