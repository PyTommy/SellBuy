import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getProducts, refreshProducts } from '../../store/actions/product';


import Product from '../UI/Product/Product';
import Scroller from '../UI/Scroller/Scroller';
import Search from './Search/Search';
import styles from './Products.module.scss';


const Products = ({
    getProducts,
    refreshProducts,
    product: { products, hasMore, loading },
    filter: { search, category }
}) => {
    const loadMore = () => {
        if (!loading.getProducts) {
            getProducts({
                skip: products.length,
                limit: 10,
                search,
                category
            })
        }
    };

    const refresh = () => !loading.getProducts && refreshProducts();

    const onSubmit = () => {
        refresh();
    };

    const productList = products.map((singleProduct) => {
        return <Product key={singleProduct._id} product={singleProduct} />;
    });

    return (
        <div>
            <Search onSubmit={onSubmit} />
            <Scroller
                onRefreshFunc={refresh}
                loadMoreFunc={loadMore}
                hasMore={hasMore}
            >
                <div className={styles.Products}>
                    {
                        productList.length === 0 && !hasMore ? (
                            <p styles={{ paddingBottom: "30rem" }}>No product found</p>
                        ) : productList

                    }
                </div>
            </Scroller>
        </div>
    );
};

Products.propTypes = {
    product: PropTypes.object.isRequired,
    filter: PropTypes.object.isRequired,
    getProducts: PropTypes.func.isRequired,
    refreshProducts: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    product: state.product,
    filter: state.filter
});

const mapDispatchToProps = (dispatch) => ({
    getProducts: (obj) => dispatch(getProducts(obj)),
    refreshProducts: () => dispatch(refreshProducts())
});

export default connect(mapStateToProps, mapDispatchToProps)(Products);