import React, { Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { clearLiked, getLiked, clearPurchased, getPurchased, clearSellings, getSellings } from '../../store/actions/mylist';
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
    // Assign "liked", "purchased" or "sellings"
    const status = match.params.status;

    const buttons = [
        {
            text: "Liked",
            active: status === 'liked',
            onClickHandler: () => status !== "liked" && history.push('/mylist/liked')
        },
        {
            text: "Purchased",
            active: status === 'purchased',
            onClickHandler: () => status !== "purchased" && history.push('/mylist/purchased')
        },
        {
            text: "Sellings",
            active: status === 'sellings',
            onClickHandler: () => status !== "sellings" && history.push('/mylist/sellings')
        }
    ];


    let
        hasMore = true,
        productArray = [],
        fetchProducts = () => null,
        refresh = () => null;
    switch (status) {
        case "liked":
            productArray = liked.products;
            hasMore = liked.hasMore;
            if (auth.isAuthenticated && !liked.loading) {
                fetchProducts = () => getLiked(liked.products.length);
                refresh = () => clearLiked();
            }
            break;
        case "purchased":
            productArray = purchased.products;
            hasMore = purchased.hasMore;
            if (auth.isAuthenticated && !purchased.loading) {
                fetchProducts = () => getPurchased(purchased.products.length);
                refresh = () => clearPurchased();
            }
            break;
        case "sellings":
            productArray = sellings.products;
            hasMore = sellings.hasMore;
            if (auth.isAuthenticated && !sellings.loading) {
                fetchProducts = () => getSellings(sellings.products.length);
                refresh = () => clearSellings();
            }
            break;
        default:
            return <Redirect to="404" />
    }

    const productList = productArray.map((product) => {
        return <Product key={product._id} product={product} />;
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
