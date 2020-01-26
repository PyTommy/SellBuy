import React from 'react'
import { withRouter } from 'react-router-dom';
import styles from './TopBar.module.scss';
import { IoIosArrowBack } from 'react-icons/io';

const TopBar = ({ children, history }) => {
    return (
        <div className={styles.TopBar}>
            <div
                className={styles.GoBack}
                onClick={e => history.goBack()}
            >
                <IoIosArrowBack />
            </div>
            {children}
        </div>
    )
}

export default withRouter(TopBar);
