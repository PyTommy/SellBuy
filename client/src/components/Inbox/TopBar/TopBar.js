import React from 'react'
import PropTypes from 'prop-types'
import styles from './TopBar.module.scss';

const TopBar = props => {
    const recievedBtnClass = [styles.button];
    const sentBtnClass = [styles.button];

    if (props.checkRecieved) {
        recievedBtnClass.push(styles.active);
    } else {
        sentBtnClass.push(styles.active);
    }

    return (
        <div className={styles.TopBar}>
            <button
                onClick={() => props.onClickHandler(true)}
                className={recievedBtnClass.join(" ")}
            >Recieved
            </button>
            <button
                onClick={() => props.onClickHandler(false)}
                className={sentBtnClass.join(" ")}
            >Sent
            </button>
        </div>
    )
}

TopBar.propTypes = {

}

export default TopBar
