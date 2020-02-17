import React from 'react'
import PropTypes from 'prop-types'

import styles from './UserInfoCard.module.scss';
import UserInfo from '../UserInfo/UserInfo';
import { IoIosArrowForward } from 'react-icons/io';

// props
// onClick : Function
// name : String
// (opt) avatar : Obj 

const UserInfoCard = props => {
    return (
        <div className={styles.card} onClick={props.onClick} >
            <UserInfo
                name={props.name}
                avatar={props.avatar}
                imageLeft={false}
                fontSize="1.6rem"
                imageSize="4rem"
            />
            <IoIosArrowForward />
        </div>
    )
}

UserInfoCard.propTypes = {
    linkTo: PropTypes.string,
}

export default UserInfoCard
