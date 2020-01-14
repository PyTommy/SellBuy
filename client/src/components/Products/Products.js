import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getProducts, refreshProducts } from '../../actions/product';
import InfiniteScroll from 'react-infinite-scroll-component';

import Product from './Product/Product';
import Spinner from '../UI/Spinner/Spinner';
import classes from './Products.module.scss';

const Products = ({ getProducts, refreshProducts, product: {products, hasMore}}) => {
    const fetchProducts = () => {
        getProducts(products.length, 15);
    }

    const refresh = () => {
        refreshProducts(0, 5);
    };

    const productList = products.map((singleProduct)=> {
        return <Product key={singleProduct._id} product={singleProduct} />;
    });



    return (
        <InfiniteScroll
            dataLength={products.length}
            next={fetchProducts}
            hasMore={hasMore}
            loader={<Spinner size={50}/>}
            scrollThreshold={products.length < 35 ? 0 : 0.8}
            endMessage={
                <p style={{textAlign: 'center'}}>
                <b>Yay! You have seen it all</b>
                </p>}
            refreshFunction={refresh}
            pullDownToRefresh
            pullDownToRefreshContent={
                <h3 style={{textAlign: 'center'}}>&#8595; Pull down to refresh</h3>
            }
            releaseToRefreshContent={
                <h3 style={{textAlign: 'center'}}>&#8593; Release to refresh</h3>
            }
        >
            <div className={classes.Products}>  
            {productList}
            </div>
        </InfiniteScroll>
    );
};

Products.propTypes = {
    product: PropTypes.object.isRequired,
    getProducts: PropTypes.func.isRequired,
    refreshProducts: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    product: state.product
});

export default connect(mapStateToProps, { getProducts, refreshProducts })(Products);