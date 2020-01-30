import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Input from '../../UI/Input/Input';
import Button from '../../UI/Button/Button';


const ReplyForm = (props) => {
    const [message, setMessage] = useState('');

    const onSubmitHandler = (e) => {
        e.preventDefault();
        props.onSubmitHandler(message);
    };

    return (
        <form onSubmit={(e) => onSubmitHandler(e)}>
            <Input
                type="textarea"
                placeholder="Reply message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required={true}
            />
            <Button
                btnType="color-primary"
                loading={props.loading}
            >Reply
            </Button>
        </form>
    )
}

ReplyForm.propTypes = {
    onSubmitHandler: PropTypes.func.isRequired,
}

export default ReplyForm;
