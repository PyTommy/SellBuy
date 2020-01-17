import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getConversations } from '../../actions/message';
import Spinner from '../UI/Spinner/Spinner';

import Message from './Message/Message';

const Messages = ({
    message: {
        conversations,
        loading
    },
    getConversations
}) => {
    useEffect(() => {
        if (!loading.conversations && (!conversations || conversations.length === 0)) {
            getConversations();
        }
    }, [getConversations, loading, conversations]);

    if (loading.conversations) return <Spinner />;
    if (!conversations || conversations.length === 0) return <p>No Conversation yet</p>;

    return (
        <ul>
            {
                conversations.map((conversation) => {
                    return (
                        <Message key={conversation.counterParty._id} conversation={conversation} />
                    );
                }
                )
            }
        </ul>
    );
};

const mapStateToProps = state => ({
    message: state.message
});

export default connect(mapStateToProps, { getConversations })(Messages);