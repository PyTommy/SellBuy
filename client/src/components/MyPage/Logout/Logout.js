import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../../store/actions/auth';

import Button from '../../UI/Button/Button';

const Logout = ({
    logout,
    history
}) => {
    const logoutHandler = () => {
        logout();
        history.push('/');
    };

    return (
        <Button
            style={{ marginLeft: "auto", marginRight: "auto" }}
            btnType="border-gray size-lg"
            onClick={logoutHandler}
        >Logout
        </Button>
    )
}

Logout.propTypes = {
    logout: PropTypes.func.isRequired
};

export default connect(null, { logout })(withRouter(Logout));