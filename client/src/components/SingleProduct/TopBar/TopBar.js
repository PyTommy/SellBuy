import React, { Fragment, useState } from 'react'
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
    // actions
    deleteProduct,
    setLike,
    setUnlike,
}) => {
    const [loading, setLoading] = useState(false);

    let isLiked = false;
    if (auth.isAuthenticated && product) {
        isLiked = product.likes.includes(auth.user._id);
    }

    const onLikeButtonClicked = () => {
        if (!auth.isAuthenticated) return history.push('/auth');

        setLoading(true);
        const callback = () => setLoading(false);

        isLiked ? setUnlike(match.params.id, callback) : setLike(match.params.id, callback);
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
                {auth.isAuthenticated && auth.user._id === product.user && product.sold === false && (
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
                    loading={loading}
                    onClick={() => onLikeButtonClicked()}
                    isLiked={isLiked}
                />
            </div>
        </UITopBar>
    )
}

TopBar.propTypes = {
    product: PropTypes.object,
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
