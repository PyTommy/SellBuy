import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getProducts, refreshProducts } from '../../store/actions/product';


import Product from '../UI/Product/Product';
import Scroller from '../UI/Scroller/Scroller';
import Search from './Search/Search';
import styles from './Products.module.scss';


const Products = ({ getProducts, refreshProducts, product: { products, hasMore, loading } }) => {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");

    const onSubmit = () => {
        refresh();
    };

    const loadMore = () => {
        if (!loading.getProducts) {
            getProducts({
                skip: products.length,
                limit: 10,
                search: search,
                category: category
            })
        }
    };
    const refresh = () => !loading.getProducts && refreshProducts();

    const productList = products.map((singleProduct) => {
        return <Product key={singleProduct._id} product={singleProduct} />;
    });

    return (
        <div>
            <Search
                search={search}
                category={category}
                setSearch={setSearch}
                setCategory={setCategory}
                onSubmit={onSubmit}
            />
            <Scroller
                onRefreshFunc={refresh}
                loadMoreFunc={loadMore}
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