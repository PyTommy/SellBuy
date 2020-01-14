import React from 'react'
import PropTypes from 'prop-types'
import styles from './BottomBar.module.scss';

const BottomBar = ({ text, buttonText, onButtonClick }) => {
    return (
        <div className={styles.BottomBar}>
            <div className={styles.text}>{text}</div>
            <button
                className={styles.button}
                onClick={onButtonClick}
            >{buttonText}
            </button>
        </div>
    )
}

BottomBar.propTypes = {
    text: PropTypes.string,
    buttonText: PropTypes.string.isRequired,
    onButtonClick: PropTypes.func.isRequired,
}

export default BottomBar;
