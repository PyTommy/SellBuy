import React from 'react'
import PropTypes from 'prop-types';
import { IoIosHeartEmpty, IoIosHeart } from 'react-icons/io';
import styles from './LikeButton.module.scss';
import Spinner from '../Spinner/Spinner';

const LikeButton = ({
    spinnerSize = 35,
    onClick,
    isLiked,
    loading = false
}) => {
    if (loading) return <Spinner style={{ margin: 0 }} size={spinnerSize} color="pink" />;

    return (
        <button className={styles.likeButton} onClick={(e) => onClick()} >
            { isLiked 
                ? <IoIosHeart className={styles.Like}/>
                : <IoIosHeartEmpty className={styles.Unlike} />
            }
        </button>
    );
}

LikeButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    isLiked: PropTypes.bool.isRequired,
    spinnerSize: PropTypes.number,
}

export default LikeButton;
