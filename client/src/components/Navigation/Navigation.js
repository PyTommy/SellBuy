import React from 'react';
import { connect } from 'react-redux';
import { IoMdHome, IoIosList, IoMdMail, IoMdContact, IoIosSearch } from "react-icons/io";
import { MdAttachMoney } from "react-icons/md";
import NavItem from './hoc';

import styles from './Navigation.module.scss';

const Navigation = (props) => {
    const HomeNav = NavItem(IoMdHome);
    const MyList = NavItem(IoIosList);
    const SellNav = NavItem(MdAttachMoney);
    const InboxNav = NavItem(IoMdMail);
    const MyPageNav = NavItem(IoMdContact);
    const AuthNav = NavItem(IoMdContact);

    // Changing Navigations depend on isAuthentication
    const navs = props.auth.isAuthenticated ? (
        <React.Fragment>

            <MyList linkTo="/mylist">My List</MyList>
            <SellNav linkTo="/sell">Sell</SellNav>
            <InboxNav linkTo="/inbox">Inbox</InboxNav>
            <MyPageNav linkTo="/mypage">My Page</MyPageNav>
        </React.Fragment>
    )
        : <AuthNav linkTo="/auth">Auth</AuthNav>;

    return (
        <header className={styles.Navigation} >
            <div className={styles.search}>
                <input placeholder="Search" className={styles.searchInput} />
                <button><IoIosSearch className={styles.searchIcon} /></button>
            </div>
            <ul className={styles.NavigationItems}>
                <HomeNav linkTo="/products">Home</HomeNav>
                {navs}
            </ul>
        </header>
    );
};

const mapStateToProps = (state) => {
    return {
        auth: state.auth
    };
};

export default connect(mapStateToProps)(Navigation);