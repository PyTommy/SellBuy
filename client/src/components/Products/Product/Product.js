import React from 'react';
import { withRouter } from 'react-router-dom';
import imageConverter from '../../../utils/imageConverter';
import ago from '../../../utils/ago';

import styles from './Product.module.scss';
import PictureRadius from '../../UI/Pictures/PictureRadius/PictureRadius';

const product = ({ history, product }) => {
    const { _id, price, name, meetupAt, createdAt } = product;

    const imageSrc = imageConverter(product.productImageLow.data);

    const avatarSrc = product.avatar
        ? imageConverter(product.avatar.data)
        : imageConverter(null)

    return (
        <div className={styles.Product} onClick={(e) => { history.push(`/products/${_id}`) }}>
            {/* Main Picture*/}
            <div className={styles.imageWrapper}>
                <img alt="pic" className={styles.Image} src={imageSrc} />
                {product.sold &&
                    <div className={styles.soldOut}>SOLD-OUT</div>
                }
            </div>


            {/* Texts */}
            <div className={styles.TextBox}>
                <div className={styles.Main}>¥ {price.toLocaleString()}</div>
                <div className={styles.Sub}>{meetupAt}</div>
            </div>
        </div>
    );
};

export default withRouter(product);