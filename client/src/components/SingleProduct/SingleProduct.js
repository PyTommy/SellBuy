import React, {useEffect, Fragment} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {getProduct, deleteProduct, setLike, setUnlike, buyProduct} from '../../actions/product';
import imageConverter from '../../utils/imageConverter';

import styles from './SingleProduct.module.scss';
import PictureRadius from '../UI/Pictures/PictureRadius/PictureRadius';
import Comments from './Comments/Comments';
import {IoIosHeartEmpty, IoIosHeart} from 'react-icons/io';
import Button from '../UI/Button/Button';
import Spinner from '../UI/Spinner/Spinner';

const Product = ({
    loading, 
    product, 
    getProduct,
    history,
    match,
    deleteProduct,
    auth,
    setLike,
    setUnlike,
    buyProduct
}) => {
    useEffect(() => {
        getProduct(match.params.id);
    },[getProduct, match.params.id]);
    


    if (loading.getProduct) return <Spinner/>;

    let content;
    if (!product) {
        content = <p>Not found!</p>
    } else {
        
        const image = product.productImage ? 
            imageConverter(product.productImage.data):
            imageConverter(product.productImageLow.data);
        let avatar;
        if (product.avatar) {
            avatar = `data:image/jpeg;base64,${imageConverter(product.avatar.data)}`;
        } else {
            avatar = require("../../assets/default.png");
        }

        let isLiked = false;
        if (auth.isAuthenticated) {
            isLiked = !!product.likes.find((like) => {
                return like.user === auth.user._id;
            }); 
        }
        let likeButton;
        if (loading.likes) {
            likeButton = <Spinner style={{margin: 0}} size={35} color="pink" />;
        } else if (isLiked) {
            likeButton = (
                <button className={styles.likeButton} onClick={(e) => setUnlike(match.params.id)} >
                    <IoIosHeart 
                        className={styles.Like}
                    /> 
                </button>
            )
        } else { 
            likeButton = (
            <button className={styles.likeButton} onClick={(e) => {
                    if (!auth.isAuthenticated) {
                        history.push('/auth')
                    } else {
                        setLike(match.params.id)
                    }
                }}>
                <IoIosHeartEmpty 
                    className={styles.Unlike}
                /> 
            </button>)
        }


        content = (<div className={styles.Product}>
            <div className={styles.TopBar}>
                <div  
                    className={styles.GoBack}
                    onClick={e => history.goBack()}
                    >{"< "}Back</div>
                { auth.isAuthenticated && auth.user._id === product.user &&(
                    <Fragment>
                        <Button btnType="color-orange size-sm">Edit</Button>
                        <Button btnType="color-danger size-sm" onClick={(e) => {
                            deleteProduct(match.params.id);
                            history.push('/products');
                            }}>Delete
                        </Button>
                    </Fragment>)
                 }
                {likeButton}
            </div>
            <div className={styles.BottomBar}>
                <div className={styles.BottomBarText}>¥ {product.price.toLocaleString()}</div>
                <Button 
                    btnType="color-primary size-lg"
                    onClick={() => buyProduct(match.params.id)}
                    >{product.sold ? "Sold-out": "Buy"}
                </Button>
            </div>

            {/* Main Picture*/}
            <img alt="pic" className={styles.Image} src={`data:image/jpg;base64,${image}`}/>
            <div className={styles.Container}>
                {/* Texts */}
                <h2 className={styles.Main}>{product.title}</h2>    
                <ul className={styles.ItemList}>
                    <li>Category: {product.category}</li>
                    <li>Meetup Place: {product.meetupAt}</li>
                </ul>     
                {/* USER INFO*/}
                <div className={styles.User}>
                    <div className={styles.UserName}>{product.name}</div>
                    <PictureRadius 
                        alt="Profile Picture"
                        src={avatar}
                        size="3rem"
                        className={styles.UserPicture}
                    />
                </div>
                <h3>Description</h3>
                <div>{product.description}</div>
                <Comments />
            </div>
        </div>);
    }

    return content;
};

Product.propTypes = {
    product: PropTypes.object,
    loading: PropTypes.object.isRequired,
    getProduct: PropTypes.func.isRequired,
    deleteProduct:PropTypes.func.isRequired,
    auth: PropTypes.object,
    setLike: PropTypes.func.isRequired,
    setUnlike: PropTypes.func.isRequired,
    buyProduct: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    product: state.product.product,
    loading: state.product.loading,
    auth: state.auth
});

export default connect(mapStateToProps,{getProduct, deleteProduct, setLike, setUnlike, buyProduct})(Product);