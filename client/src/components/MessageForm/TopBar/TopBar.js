import React from 'react';
import { withRouter } from 'react-router-dom';
import PictureRadius from '../../UI/Pictures/PictureRadius/PictureRadius';
import imageConverter from '../../../utils/imageConverter';
import styles from './TopBar.module.scss';

import UITopBar from '../../UI/TopBar/TopBar';


const TopBar = ({
    history,
    counterParty
}) => {

    let avatarSrc;
    if (counterParty) {
        avatarSrc = counterParty.avatar
            ? imageConverter(counterParty.avatar.data)
            : imageConverter(null);
    }

    return (
        <UITopBar
            goBack={() => history.goBack()}
        >
            {counterParty &&
                <div className={styles.userInfo} onClick={() => history.push(`/profile/${counterParty._id}`)}>
                    <PictureRadius src={avatarSrc} />
                    <div className={styles.userName}>{counterParty.name}</div>
                </div>
            }
        </UITopBar>
    )
}

export default withRouter(TopBar);
