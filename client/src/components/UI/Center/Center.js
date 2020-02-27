import React from 'react'
import styles from './Center.module.scss';
export default props => {
    return (
        <div className={styles.center}>
            {props.children}
        </div>
    )
}
