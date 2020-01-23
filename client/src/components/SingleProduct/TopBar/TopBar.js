import React, { Fragment } from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types'
import { deleteProduct, setLike, setUnlike } from '../../../store/actions/product';
import styles from './TopBar.module.scss';

import UITopBar from '../../UI/TopBar/TopBar';
import Button from '../../UI/Button/Button';
import LikeButton from '../../UI/LikeButton/LikeButton';

const TopBar = ({
    history,
    match,
    // store    
    auth,
    product,
    loadingLike,
    // actions
    deleteProduct,
    setLike,
    setUnlike,
}) => {
    let isLiked = false;
    if (auth.isAuthenticated && product) { // set product before didmount to remove "&& product"
        isLiked = !!product.likes.find((like) => {
            return like.user === auth.user._id;
        });
    }
    const onLikeButtonClicked = () => {
        if (!auth.isAuthenticated) {
            return history.push('/auth');
        }
        isLiked ? setUnlike(match.params.id) : setLike(match.params.id);
    }

    const onEditButtonClicked = () => {
        history.push(`/edit/${product._id}`)
    };

    const onDeleteButtonClicked = () => {
        deleteProduct(match.params.id);
        history.push('/products');
    };

    return (
        <UITopBar>
            <div className={styles.items}>
                {auth.isAuthenticated && auth.user._id === product.user && (
                    <Fragment>
                        <Button
                            btnType="color-orange size-sm"
                            onClick={onEditButtonClicked}
                        >Edit
                        </Button>
                        <Button
                            btnType="color-danger size-sm"
                            onClick={onDeleteButtonClicked}
                        >Delete
                        </Button>
                    </Fragment>)
                }
                <LikeButton
                    loading={loadingLike}
                    onClick={() => onLikeButtonClicked()}
                    isLiked={isLiked}
                />
            </div>
        </UITopBar>
    )
}

TopBar.propTypes = {
    product: PropTypes.object,
    loadingLike: PropTypes.bool.isRequired,
    auth: PropTypes.object,
    deleteProduct: PropTypes.func.isRequired,
    setLike: PropTypes.func.isRequired,
    setUnlike: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    product: state.product.product,
    loadingLike: state.product.loading.likes,
    auth: state.auth
});

export default connect(mapStateToProps, { deleteProduct, setLike, setUnlike })(withRouter(TopBar));
