import React from 'react';
import { withRouter } from 'react-router-dom';
import imageConverter from '../../../utils/imageConverter';
import textAbstract from '../../../utils/textAbstract';


import styles from './Product.module.scss';

const product = ({ history, product }) => {
    const { _id, price, meetupAt } = product;

    const imageSrc = imageConverter(product.productImageLow.data);


    return (
        <div className={styles.Product} onClick={(e) => { history.push(`/products/${_id}`) }}>
            <div className={styles.imageWrapper}>
                <img alt="pic" className={styles.Image} src={imageSrc} />
                {product.sold &&
                    <div className={styles.soldOut}>SOLD-OUT</div>
                }
            </div>
            <div className={styles.TextBox}>
                <div className={styles.Main}>¥ {price.toLocaleString()}</div>
                <div className={styles.Sub}>{textAbstract(meetupAt, 9)}</div>
            </div>
        </div>
    );
};

export default withRouter(product);