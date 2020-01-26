import React, { Fragment } from 'react'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import imageConverter from '../../../utils/imageConverter';
import styles from './Main.module.scss';
import { IoIosArrowForward } from 'react-icons/io';

import Comments from '../Comments/Comments';
import UserInfo from '../../UI/UserInfo/UserInfo';

const Main = ({
    history,
    product: {
        productImage,
        productImageLow,
        avatar,
        name,
        description,
        meetupAt,
        title,
        user,
        purchaser
    }
}) => {
    const imageSrc = productImage
        ? imageConverter(productImage.data)
        : imageConverter(productImageLow.data);

    return (
        <div className={styles.Main}>
            <img alt="pic" className={styles.Image} src={imageSrc} />
            <div className={styles.Container}>
                <h2 >{title}</h2>
                <div className={styles.subContainer} >{description}</div>
                <h3>Meetup Place</h3>
                <div className={styles.subContainer}>
                    <p>{meetupAt}</p>
                </div>
                <h3>Seller</h3>
                <div className={styles.card} onClick={() => history.push(`/profile/${user}`)} >
                    <UserInfo
                        name={name}
                        avatar={avatar}
                        imageLeft={false}
                        fontSize="1.6rem"
                        imageSize="4rem"
                    />
                    <IoIosArrowForward />
                </div>
                {purchaser && purchaser.name &&
                    <Fragment>
                        <h3> Purchaser</h3>
                        <div className={styles.card} onClick={() => history.push(`/profile/${purchaser._id}`)}>
                            <UserInfo
                                name={purchaser.name}
                                avatar={purchaser.avatar}
                                imageLeft={false}
                                fontSize="1.6rem"
                                imageSize="4rem"
                            />
                            <IoIosArrowForward />
                        </div>
                    </Fragment>
                }
                <Comments />
            </div>
        </div >
    )
}

Main.propTypes = {
    product: PropTypes.object,
}

const mapStateToProps = state => ({
    product: state.product.product
});

export default connect(mapStateToProps, null)(withRouter(Main));
