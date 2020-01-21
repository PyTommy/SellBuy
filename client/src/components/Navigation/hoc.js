import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Navigation.module.scss';

const NavItem = (WrapperComponent) => {
    return (props) => (
        <li>
            <NavLink to={props.linkTo} activeClassName={styles.active}>
                <WrapperComponent className={styles.Icon} />
                <span className={styles.menuTitle}>{props.children}</span>
            </NavLink>
        </li>
    );
};

export default NavItem;