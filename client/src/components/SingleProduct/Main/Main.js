import React, { Fragment } from 'react'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import imageConverter from '../../../utils/imageConverter';
import styles from './Main.module.scss';

import Comments from '../Comments/Comments';
import UserInfoCard from '../../UI/UserInfoCard/UserInfoCard';

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
                <UserInfoCard
                    name={name}
                    avatar={avatar}
                    onClick={() => history.push(`/profile/${user}`)}
                />

                {purchaser && purchaser.name &&
                    <Fragment>
                        <h3> Purchaser</h3>
                        <UserInfoCard
                            name={purchaser.name}
                            avatar={purchaser.avatar}
                            onClick={() => history.push(`/profile/${purchaser._id}`)}
                        />
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
