import React, { useEffect, useState } from 'react';
import Navigation from '../../components/Navigation/Navigation';
import styles from './Layout.module.scss';
import { connect } from 'react-redux';
import Alerts from './Alerts/Alerts';

const layout = (props) => {

    // let alerts = null;
    // if (props.alerts.length > 0) {
    //     alerts = <Alerts />;
    // }


    return (
        <React.Fragment>
            <Alerts />
            <Navigation />
            <main className={styles.main}>
                {props.children}
            </main>
        </React.Fragment>
    );
};

const mapStateToProps = (state) => {
    return {
        alerts: state.alerts
    };
};


export default connect(mapStateToProps)(layout);

