import React from 'react'
import PropTypes from 'prop-types'

import styles from './Message.module.scss';
import TextToJSX from '../../UI/TextToJSX/TextToJSX';

const Message = ({ message, counterParty, amIRecipient }) => {

    const toOrFrom = amIRecipient
        ? "from"
        : "to";


    return (
        <div className={styles.Message}>
            <div className={styles.Message}>
                <div>Message {toOrFrom} {counterParty.name}</div>
                <div className={styles.textsContainer} >
                    <TextToJSX>{message.text}</TextToJSX>
                </div>
            </div>
        </div>
    )
}

Message.propTypes = {
    amIRecipient: PropTypes.bool.isRequired,
    message: PropTypes.object.isRequired,
    counterParty: PropTypes.object.isRequired,
}

export default Message
