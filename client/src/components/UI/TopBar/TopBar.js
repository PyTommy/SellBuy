import React from 'react'
import { withRouter } from 'react-router-dom';
import styles from './TopBar.module.scss';

const TopBar = ({ children, history }) => {
    return (
        <div className={styles.TopBar}>
            <div
                className={styles.GoBack}
                onClick={e => history.goBack()}
            >
                <span>{"<"}</span>
            </div>
            {children}
        </div>
    )
}

export default withRouter(TopBar);
