import React, { useState } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import Input from '../UI/Input/Input';
import { sendMessage } from '../../actions/message';

const MessageForm = ({ sendMessage, match }) => {
    const [message, setMessage] = useState('');

    const onSubmitHandler = (e) => {
        e.preventDefault();
        sendMessage(match.params.id, message);
    };

    return (
        <form onSubmit={onSubmitHandler}>
            <Input
                type="textarea"
                placeholder="Message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required={true}
            />
            <button>Send</button>
        </form>
    )
}

MessageForm.propTypes = {
}

export default connect(null, { sendMessage })(MessageForm);