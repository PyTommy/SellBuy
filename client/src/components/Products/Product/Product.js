import React from 'react';
import {withRouter} from 'react-router-dom';
import imageConverter from '../../../utils/imageConverter';
import moment from 'moment';

import styles from './Product.module.scss';
import PictureRadius from '../../UI/Pictures/PictureRadius/PictureRadius';

const product = ({history, product}) => {
    const { _id, user, price, name, sold, title, description, category, meetupAt, date, likes, comments } = product;

    const image = imageConverter(product.productImage.data);
    
    let avatar;
    if (product.avatar) {
        avatar = `data:image/jpeg;base64,${imageConverter(product.avatar.data)}`;
    } else {
        avatar = require("../../../assets/default.png");
    }

    return (
        <div className={styles.Product} onClick={(e) => {history.push(`/products/${_id}`)}}>
            {/* USER INFO*/}
            <div className={styles.User}>
                <PictureRadius 
                    alt="ProfilePic"
                    src={avatar}
                    size="3rem"
                    className={styles.UserPicture}
                />
                <div className={styles.UserName}>{name}</div>
                <div className={styles.Time}>{moment(date).fromNow()}</div>
            </div>

            {/* Main Picture*/}
            <img alt="pic" className={styles.Image} src={`data:image/jpeg;base64,${image}`}/>

            {/* Texts */}
            <div className={styles.TextBox}>
                <div className={styles.Main}>¥ {price.toLocaleString()}</div>
                <div className={styles.Subs}>
                    <div>{title}</div>
                    <div>{meetupAt}</div>
                </div>
            </div>

            {/* Bottom bar*/}
            <div className={styles.BottomBar}>
                <div>
                    {likes.length} Likes
                </div>
                <div>{comments.length} Comments</div>
            </div>
        </div>
    );
};

export default withRouter(product);