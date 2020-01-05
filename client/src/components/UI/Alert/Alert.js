import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styles from './Alert.module.scss';

const Alert = ({alerts}) => alerts !== null && alerts.length > 0 && alerts.map (alert => (
    <div 
        key={alert.id} 
        className={alert.alertType === "success" ? 
            [styles.Alert, styles.Success].join(" "):
            [styles.Alert, styles.Danger].join(" ")}
        >{alert.msg}
    </div>
)) ;

Alert.propTypes = {
    alerts: PropTypes.array.isRequired
};

const mapStateToProps = (state) => {
    return {
        alerts: state.alerts
    }
};

export default connect(mapStateToProps)(Alert);
