import React from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import Input from '../UI/Input/Input';
import styles from './Conversation.module.scss';
import Message from './Message/Message';

const Conversation = props => {
    return (
        <div className={styles.Conversation}>
            <ul>
                <Message text="ifejiaj" name="jfieoaj" />
            </ul>
            <div className={styles.bottom}>
                <Input />
                <button>send</button>
            </div>
        </div>
    )
}

Conversation.propTypes = {

}

export default connect()(Conversation);
