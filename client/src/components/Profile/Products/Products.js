import React from 'react'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import styles from './Products.module.scss';

// Action
import { getProfileProducts } from '../../../store/actions/profile';

// Components
import Product from '../../UI/Product/Product';
import Spinner from '../../UI/Spinner/Spinner';
import InfiniteScroller from 'react-infinite-scroller';

const Products = ({ match, products, hasMore, loading, getProfileProducts }) => {
    const loadMore = loading
        ? () => null
        : () => getProfileProducts(match.params.id, products.length);

    let productList = null;
    if (!loading && products.length === 0) productList = <p>No selling products</p>;
    if (products.length > 0) {
        productList = products.map((product) => <Product key={product._id} product={product} />);
    }

    return (
        <div style={{ width: "100%" }}>
            <InfiniteScroller
                pageStart={0}
                threshold={250}
                loadMore={loadMore}
                hasMore={hasMore}
                loader={<Spinner key={"abc"} size={50} style={{ marginTop: "3rem" }} />}
            >
                <div className={styles.items}>
                    {productList}
                </div>
            </InfiniteScroller>
        </div>
    )
}

Products.propTypes = {
    products: PropTypes.array.isRequired,
    hasMore: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
}

const mapStateToProps = state => ({
    products: state.profile.products.products,
    hasMore: state.profile.products.hasMore,
    loading: state.profile.loading.products,
});

export default connect(mapStateToProps, { getProfileProducts })(withRouter(Products));
