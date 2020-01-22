import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getProducts, refreshProducts } from '../../actions/product';


import Product from '../UI/Product/Product';
import Scroller from '../UI/Scroller/Scroller';
import styles from './Products.module.scss';


const Products = ({ getProducts, refreshProducts, product: { products, hasMore, loading } }) => {
    const fetchProducts = () => {
        if (!loading.getProducts) {
            getProducts(products.length, 10);
        }
    }

    const refresh = () => {
        if (!loading.getProducts) {
            refreshProducts(0, 10);
        }
    };

    const productList = products.map((singleProduct) => {
        return <Product key={singleProduct._id} product={singleProduct} />;
    });



    return (
        <div>
            <Scroller
                onRefreshFunc={refresh}
                loadMoreFunc={fetchProducts}
                hasMore={hasMore}
            >
                <div className={styles.Products}>
                    {productList}
                </div>
            </Scroller>
        </div>
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