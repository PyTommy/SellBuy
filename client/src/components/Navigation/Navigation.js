import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { IoMdHome, IoIosList, IoMdMail, IoMdContact, IoMdNotifications } from "react-icons/io";
import { MdAttachMoney } from "react-icons/md";
import NavItem from './NavItem/NavItem';
import Search from './Search/Search';

import styles from './Navigation.module.scss';


const Navigation = (props) => {
    const { auth, msgCount, notificationCount, location } = props
    const HomeNav = NavItem(IoMdHome);
    const MyList = NavItem(IoIosList);
    const SellNav = NavItem(MdAttachMoney);
    const NotificationNav = NavItem(IoMdNotifications, notificationCount);
    const InboxNav = NavItem(IoMdMail, msgCount);
    const MyPageNav = NavItem(IoMdContact);
    const AuthNav = NavItem(IoMdContact);



    // Changing Navigations depend on isAuthentication
    const navItems = auth.isAuthenticated ? (
        <Fragment>
            <HomeNav linkTo="/products">Home</HomeNav>
            <MyList linkTo="/mylist">My List</MyList>
            <SellNav linkTo="/sell">Sell</SellNav>
            <NotificationNav linkTo="/notification">Notification</NotificationNav>
            <InboxNav linkTo="/inbox">Inbox</InboxNav>
            <MyPageNav linkTo="/mypage">My Page</MyPageNav>
        </Fragment>
    ) : (
            <Fragment>
                <HomeNav linkTo="/products">Home</HomeNav>
                <AuthNav linkTo="/auth">Auth</AuthNav>
            </Fragment>
        );

    return (
        <header className={styles.Navigation} >
            {location.pathname === "/products" && <Search />}
            <ul className={styles.NavigationItems}>
                {navItems}
            </ul>
        </header>
    );
};

const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        msgCount: state.message.count,
        notificationCount: state.notification.count,
    };
};

export default connect(mapStateToProps)(withRouter(Navigation));