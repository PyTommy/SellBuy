import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { IoMdHome, IoIosList, IoMdMail, IoMdContact, IoIosSearch, IoMdNotifications } from "react-icons/io";
import { MdAttachMoney } from "react-icons/md";
import NavItem from './NavItem/NavItem';

import styles from './Navigation.module.scss';


const Navigation = ({ auth, msgCount, notificationCount }) => {
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
            <MyList linkTo="/mylist/liked">My List</MyList>
            <SellNav linkTo="/sell">Sell</SellNav>
            <NotificationNav linkTo="/notification">Notification</NotificationNav>
            <InboxNav linkTo="/inbox/recieved">Inbox</InboxNav>
            <MyPageNav linkTo="/mypage">My Page</MyPageNav>
        </Fragment>
    )
        :
        <Fragment>
            <HomeNav linkTo="/products">Home</HomeNav>
            <AuthNav linkTo="/auth">Auth</AuthNav>
        </Fragment>

    return (
        <header className={styles.Navigation} >
            <div className={styles.search}>
                <input placeholder="Search" className={styles.searchInput} />
                <button><IoIosSearch className={styles.searchIcon} /></button>
            </div>
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

export default connect(mapStateToProps)(Navigation);