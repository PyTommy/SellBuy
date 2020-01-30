import React from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';
import PullToRefresh from 'rmc-pull-to-refresh';
import Spinner from '../Spinner/Spinner';

const Scroller = ({
    onRefreshFunc,
    loadMoreFunc,
    hasMore,
    children,
    spinnerSize = 40,
    spinnerMarginTop = "2rem",
}) => {
    const switchContainer = true;
    const invisible = <span style={{ display: "none" }}></span>;
    const activate = <p style={{
        position: "absolute",
        top: 0,
        left: "50%",
        transform: "translate(-50%, -100%)",
        marginTop: "-1.5rem",
        paddingBottom: "1rem"
    }}>Release to Refresh</p>;
    const deactivate = <p style={{
        position: "absolute",
        top: 0,
        left: "50%",
        transform: "translate(-50%, -100%)",
        marginTop: "-1.5rem",
        paddingBottom: "1rem"
    }}>Pull to refresh</p>;

    return (
        <PullToRefresh
            key={switchContainer}
            {...(switchContainer ? { getScrollContainer: () => document.body } : {})}
            style={{ width: "100%", position: "relative" }}
            onRefresh={onRefreshFunc}
            indicator={{ activate, deactivate, release: invisible, finish: invisible }
            }
            distanceToRefresh={80}
            damping={250}
        >
            <InfiniteScroll
                pageStart={0}
                threshold={250}
                loadMore={loadMoreFunc}
                hasMore={hasMore}
                loader={<Spinner key={"abc"} size={spinnerSize} style={{ marginTop: spinnerMarginTop }} />}
            >
                {children}
            </InfiniteScroll>
        </PullToRefresh >
    )
}

Scroller.propTypes = {
    onRefreshFunc: PropTypes.func.isRequired,
    loadMoreFunc: PropTypes.func.isRequired,
    hasMore: PropTypes.bool.isRequired,
    spinnerSize: PropTypes.number,
    spinnerMargin: PropTypes.string,
}

export default Scroller;