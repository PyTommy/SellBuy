import React from 'react'
import PropTypes from 'prop-types'
import styles from './Switcher.module.scss';

const Switcher = ({ items }) => {
    const buttons = items.map((item) => {
        let appliedClasses = [styles.button];
        if (item.active) appliedClasses.push(styles.active);

        return (
            <button
                key={item.text}
                onClick={item.onClickHandler}
                className={appliedClasses.join(" ")}
            >{item.text}
            </button>
        );
    });

    return (
        <div className={styles.Switcher} style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
            {buttons}
        </div>
    )
}

Switcher.propTypes = {
    items: PropTypes.array.isRequired,
}

export default Switcher
