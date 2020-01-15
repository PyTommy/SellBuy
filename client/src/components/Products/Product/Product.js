import React from 'react';
import { withRouter } from 'react-router-dom';
import imageConverter from '../../../utils/imageConverter';
import moment from 'moment';

import styles from './Product.module.scss';
import PictureRadius from '../../UI/Pictures/PictureRadius/PictureRadius';

const product = ({ history, product }) => {
    const { _id, price, name, meetupAt, createdAt } = product;

    const image = imageConverter(product.productImageLow.data);

    let avatar;
    if (product.avatar) {
        avatar = `data:image/jpeg;base64,${imageConverter(product.avatar.data)}`;
    } else {
        avatar = require("../../../assets/default.png");
    }

    return (
        <div className={styles.Product} onClick={(e) => { history.push(`/products/${_id}`) }}>
            {/* USER INFO*/}
            <div className={styles.User}>
                <PictureRadius
                    alt="ProfilePic"
                    src={avatar}
                    size="2.5rem"
                />
                <div className={styles.UserName}>{name}</div>
                <div className={styles.Time}>{moment(createdAt).fromNow()}</div>
            </div>

            {/* Main Picture*/}
            <div className={styles.imageWrapper}>
                <img alt="pic" className={styles.Image} src={`data:image/jpeg;base64,${image}`} />
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