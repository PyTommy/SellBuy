import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { clearLiked, getLiked, clearPurchased, getPurchased, clearSellings, getSellings } from '../../actions/mylist';
import styles from './MyList.module.scss';

import Switcher from '../UI/Switcher/Switcher';
import Scroller from '../UI/Scroller/Scroller';
import Product from '../UI/Product/Product';

const MyList = ({
    match,
    history,
    // store
    auth,
    liked,
    purchased,
    sellings,
    // actions
    clearLiked,
    getLiked,
    clearPurchased,
    getPurchased,
    clearSellings,
    getSellings
}) => {
    const status = match.params.status;

    const buttons = [
        {
            text: "Liked",
            active: status === 'liked',
            onClickHandler: () => {
                if (status !== "liked") history.push('/mylist/liked');
            },
        },
        {
            text: "Purchased",
            active: status === 'purchased',
            onClickHandler: () => {
                if (status !== "purchased") history.push('/mylist/purchased')
            }
        },
        {
            text: "Sellings",
            active: status === 'sellings',
            onClickHandler: () => {
                if (status !== "sellings") history.push('/mylist/sellings');
            }
        }
    ];

    const fetchProducts = () => {
        if (!auth || !auth.isAuthenticated) return null;

        // If url = "myllist/liked"
        if (status === "liked" && !liked.loading) {
            getLiked(liked.products.length);
        }
        // If url = "myllist/purchased"
        if (status === "purchased" && !purchased.loading) {
            getPurchased(purchased.products.length);
        }
        // If url = "myllist/sellings"
        if (status === "sellings" && !sellings.loading) {
            getSellings(sellings.products.length);
        }


    }

    const refresh = () => {
        if (!auth || !auth.isAuthenticated) return null;

        // If url = "myllist/liked"
        if (status === "liked" && !liked.loading) {
            clearLiked();
            getLiked();
        }
        // If url = "myllist/purchased"
        if (status === "purchased" && !purchased.loading) {
            clearPurchased();
            getPurchased();
        }
        // If url = "myllist/sellings"
        if (status === "sellings" && !sellings.loading) {
            clearSellings();
            getSellings();
        }
    };

    let hasMore;
    if (status === "liked") hasMore = liked.hasMore;
    if (status === "purchased") hasMore = purchased.hasMore;
    if (status === "sellings") hasMore = sellings.hasMore;

    let productArray;
    if (status === "liked") productArray = liked.products;
    if (status === "purchased") productArray = purchased.products;
    if (status === "sellings") productArray = sellings.products;
    const productList = productArray.map((singleProduct) => {
        return <Product key={singleProduct._id} product={singleProduct} />;
    });



    return (
        <Fragment>
            <Switcher items={buttons} />
            <div style={{ marginTop: "5.5rem" }}>
                <Scroller
                    onRefreshFunc={refresh}
                    loadMoreFunc={fetchProducts}
                    hasMore={hasMore}
                >
                    {
                        !hasMore && productList.length === 0
                            ?
                            <p style={{ height: "80vh" }}>No product found</p>
                            :
                            <div className={styles.items}>
                                {productList}
                            </div>
                    }
                </Scroller>
            </div>
        </Fragment>
    );
}

MyList.propTypes = {
    liked: PropTypes.object.isRequired,
    clearLiked: PropTypes.func.isRequired,
    getLiked: PropTypes.func.isRequired,
    clearPurchased: PropTypes.func.isRequired,
    getPurchased: PropTypes.func.isRequired,
    clearSellings: PropTypes.func.isRequired,
    getSellings: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    liked: state.mylist.liked,
    purchased: state.mylist.purchased,
    sellings: state.mylist.sellings,
    auth: state.auth,
});

export default connect(mapStateToProps, { clearLiked, getLiked, clearPurchased, getPurchased, clearSellings, getSellings })(MyList)
