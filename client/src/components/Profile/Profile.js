import React, { Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import styles from './Profile.module.scss'
import { getProfile, getProfileProducts } from '../../store/actions/profile';
import imageConverter from '../../utils/imageConverter';

// import { IoLogoFacebook } from 'react-icons/io';
import { AiOutlineMessage } from 'react-icons/ai';
import TopBar from '../UI/TopBar/TopBar';
import Spinner from '../UI/Spinner/Spinner';
import InfiniteScroller from 'react-infinite-scroller';
import Product from '../UI/Product/Product';

const Profile = ({
    history,
    match,
    profile: {
        user,
        loading,
        products: {
            products,
            hasMore
        }
    },
    // actions
    getProfile,
    getProfileProducts
}) => {
    useEffect(() => {
        if (!user || user._id.toString() !== match.params.id) {
            getProfile(match.params.id);
        }
    }, [getProfile, user, match.params.id]);

    let avatarSrc;
    if (user) {
        avatarSrc = user.avatar
            ? imageConverter(user.avatar.data)
            : imageConverter(null);
    }

    let loadMore = () => null;
    if (user && !loading.products) {
        loadMore = () => {
            getProfileProducts(match.params.id, products.length);
        };
    }

    let productList = null;
    if (user && !loading.products && products.length === 0) productList = <p>No selling products</p>;
    if (user && products.length > 0) {
        productList = products.map((singleProduct) => {
            return <Product key={singleProduct._id} product={singleProduct} />;
        });
    }

    let content = <p>User not found</p>;
    if (loading.user) content = <Spinner style={{ marginTop: "5rem" }} />;
    if (!loading.user && user) {
        content =
            <Fragment>
                <img
                    src={avatarSrc}
                    alt="Profile"
                    className={styles.profileImage} />
                <h2>{user.name}</h2>
                <div className={styles.icons}>
                    <Link to={`/messages/${match.params.id}`}>
                        <AiOutlineMessage
                            size={"4rem"}
                        />
                    </Link>
                    {/* <a target="_blank" href="https://www.facebook.com/php?id=100009155066626">
                            <IoLogoFacebook
                                size={"4rem"}
                                color={"#0084ff"}
                            />
                        </a> */}
                </div>
                <div className={styles.hr}></div>
                <div style={{ width: "100%" }}>
                    <InfiniteScroller
                        pageStart={0}
                        threshold={250}
                        loadMore={loadMore}
                        hasMore={hasMore}
                        loader={<Spinner key={"abc"} size={50} style={{ marginTop: "3rem" }} />}
                    >
                        <div className={styles.items}>
                            {productList}
                        </div>
                    </InfiniteScroller>
                </div>
            </Fragment>;
    };

    return (
        <Fragment>
            <TopBar goBack={() => history.goBack()} />
            <div className={styles.Profile}>
                {content}
            </div>
        </Fragment>
    )
}

Profile.propTypes = {
    profile: PropTypes.object.isRequired,
    getProfileProducts: PropTypes.func.isRequired,
    getProfile: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    profile: state.profile,
});

export default connect(mapStateToProps, { getProfile, getProfileProducts })(Profile);
