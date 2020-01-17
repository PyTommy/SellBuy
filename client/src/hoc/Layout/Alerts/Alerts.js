import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styles from './Alerts.module.scss';

const Alerts = ({ alerts }) => {
    const appliedAlertsClass = alerts.length > 0
        ? [styles.Alerts].join(" ")
        : [styles.Alerts, styles.show].join(" ");


    return (
        <div className={appliedAlertsClass}>
            {alerts !== null && alerts.length > 0 && alerts.map(alert => (
                <div
                    key={alert.id}
                    className={alert.alertType === "success" ?
                        [styles.Alert, styles.Success].join(" ") :
                        [styles.Alert, styles.Danger].join(" ")}
                >{alert.msg}
                </div>
            ))}
        </div>
    );
}


Alerts.propTypes = {
    alerts: PropTypes.array.isRequired
};

const mapStateToProps = (state) => {
    return {
        alerts: state.alerts
    }
};

export default connect(mapStateToProps)(Alerts);
