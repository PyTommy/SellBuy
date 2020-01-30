import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getNotifications, refreshNotifications } from '../../store/actions/notification';

import styles from './Notification.module.scss';
import Notification from './Notification/Notification';
import Scroller from '../UI/Scroller/Scroller';

const Inbox
    = ({
        auth,
        notification: {
            notifications,
            hasMore,
            loading
        },
        getNotifications,
        refreshNotifications
    }) => {

        let items;
        items = notifications.map((notification) => {
            return (
                <Notification
                    key={notification._id}
                    notification={notification}
                />
            );
        })

        const noMsg = <p style={{ height: "75vh" }}>No notification yet</p>;

        let loadMore = () => null,
            refresh = () => null;
        if (auth.isAuthenticated && !loading) {
            loadMore = () => getNotifications(notifications.length);
            refresh = () => refreshNotifications();
        }

        return (
            <div>
                <Scroller
                    onRefreshFunc={refresh}
                    loadMoreFunc={loadMore}
                    hasMore={hasMore}
                >
                    <ul className={styles.notifications}>
                        {!hasMore && items.length === 0 ? noMsg : items}
                    </ul>
                </Scroller>
            </div>
        );
    };

Inbox.propTypes = {
    notification: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    getNotifications: PropTypes.func.isRequired,
    refreshNotifications: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    notification: state.notification,
    auth: state.auth,
});

export default connect(mapStateToProps, { getNotifications, refreshNotifications })(Inbox
);