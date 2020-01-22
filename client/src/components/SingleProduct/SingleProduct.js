import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getProduct, purchaseProduct, cancelProduct, rejectProduct } from '../../actions/product';


// Components
import ScrollToTop from '../ScrollToTop';
import Spinner from '../UI/Spinner/Spinner';
import BottomBar from '../UI/BottomBar/BottomBar';
import TopBar from './TopBar/TopBar';
import Main from './Main/Main';

const Product = ({
    loading,
    product,
    auth,
    getProduct,
    history,
    match,
    purchaseProduct,
    cancelProduct,
    rejectProduct
}) => {
    useEffect(() => {
        getProduct(match.params.id);
    }, [getProduct, match.params.id]);

    if (loading.getProduct) return <Spinner />;

    if (!product) return <p>Not found!</p>;

    const onPurchaseHandler = () => purchaseProduct(match.params.id);
    const onCancelHandler = () => cancelProduct(match.params.id);
    const onRejectHandler = () => rejectProduct(match.params.id);
    const onUnauthorizedHandler = () => history.push('/auth');

    let buttonText = "Purchase";
    let onClickHandler = onPurchaseHandler;
    if (!product.sold && auth.isAuthenticated && product.user.toString() === auth.user._id.toString()) {
        buttonText = "EDIT";
        onClickHandler = () => history.push(`/edit/${match.params.id}`);
    } else if (product.sold && auth.isAuthenticated && product.user.toString() === auth.user._id.toString()) {
        buttonText = "REJECT";
        onClickHandler = onRejectHandler;
    } else if (product.sold && auth.isAuthenticated && product.purchaser.user.toString() === auth.user._id.toString()) {
        buttonText = "CANCEL";
        onClickHandler = onCancelHandler;
    } else if (product.sold) {
        buttonText = "SOLD OUT";
        onClickHandler = () => null;
    }
    if (!auth.isAuthenticated) {
        onClickHandler = onUnauthorizedHandler
    }
    if (loading.purchase) {
        buttonText = <Spinner size={15} style={{ margin: 0 }} color="white" ></Spinner>;
        onClickHandler = () => null;
    }


    return (
        <div>
            <ScrollToTop />
            <TopBar />
            <Main />
            <BottomBar
                text={`¥ ${product.price.toLocaleString()}`}
                buttonText={buttonText}
                onButtonClick={onClickHandler}
            />
        </div>
    );
};

Product.propTypes = {
    product: PropTypes.object,
    loading: PropTypes.object.isRequired,
    getProduct: PropTypes.func.isRequired,
    auth: PropTypes.object,
    purchaseProduct: PropTypes.func.isRequired,
    cancelProduct: PropTypes.func.isRequired,
    rejectProduct: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    product: state.product.product,
    loading: state.product.loading,
    auth: state.auth
});

export default connect(mapStateToProps, { getProduct, purchaseProduct, cancelProduct, rejectProduct })(Product);