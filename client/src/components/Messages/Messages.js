import React from 'react';

import Message from './Message/Message';

const message = props => {

    return (
        <ul className={props.classAdded}>
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
        </ul>
    );
};

export default message;