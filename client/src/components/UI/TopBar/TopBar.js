import React from 'react'
import PropTypes from 'prop-types'
import styles from './TopBar.module.scss';

const TopBar = ({children, goBack}) => {
    return (
        <div className={styles.TopBar}>
            <div
                className={styles.GoBack}
                onClick={e => goBack()}
                >
                <span>{"< "}Back</span>
            </div>
            <div className={styles.items}>
                {children}
            </div>
        </div>
    )
}

TopBar.propTypes = {
    goBack: PropTypes.func,
}

export default TopBar
