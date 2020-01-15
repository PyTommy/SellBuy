import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getProduct, buyProduct } from '../../actions/product';

// Components
import Spinner from '../UI/Spinner/Spinner';
import BottomBar from '../UI/BottomBar/BottomBar';
import TopBar from './TopBar/TopBar';
import Main from './Main/Main';

const Product = ({
    loading,
    product,
    getProduct,
    match,
    buyProduct
}) => {
    useEffect(() => {
        getProduct(match.params.id);
    }, [getProduct, match.params.id]);

    if (loading.getProduct) return <Spinner />;

    if (!product) return <p>Not found!</p>;

    return (
        <div>
            <TopBar />
            <Main />
            <BottomBar
                text={`¥ ${product.price.toLocaleString()}`}
                buttonText={product.sold ? "Sold-out" : "Buy"}
                onButtonClick={() => buyProduct(match.params.id)}
            />
        </div>
    );
};

Product.propTypes = {
    product: PropTypes.object,
    loading: PropTypes.object.isRequired,
    getProduct: PropTypes.func.isRequired,
    auth: PropTypes.object,
    buyProduct: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    product: state.product.product,
    loading: state.product.loading,
    auth: state.auth
});

export default connect(mapStateToProps, { getProduct, buyProduct })(Product);