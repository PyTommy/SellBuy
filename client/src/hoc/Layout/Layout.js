import React from 'react';
import Navigation from '../../components/Navigation/Navigation';
import styles from './Layout.module.scss';
import {connect} from 'react-redux';
import Alert from '../../components/UI/Alert/Alert';

const layout = (props) => {

    let alerts = null;
    if (props.alerts.length > 0) {
        alerts = <Alert />;
    }

    return (
        <React.Fragment>
            <Navigation />
            <main className={styles.main}>
                {alerts}
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

