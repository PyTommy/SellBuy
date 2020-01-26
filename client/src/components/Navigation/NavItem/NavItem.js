import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './NavItem.module.scss';

const NavItem = (WrapperComponent, count = null) => {
    return (props) => (
        <li>
            <NavLink to={props.linkTo} className={styles.Link} activeClassName={[styles.Link, styles.active].join(" ")}>
                {count ? <span className={styles.counter} >{count > 99 ? 99 : count}</span> : null}
                <WrapperComponent className={styles.Icon} />
                <span className={styles.menuTitle}>{props.children}</span>
            </NavLink>
        </li>
    );
};

export default NavItem;