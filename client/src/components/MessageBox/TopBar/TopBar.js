import React from 'react';

import UITopBar from '../../UI/TopBar/TopBar';
import UserInfo from '../../UI/UserInfo/UserInfo';

const TopBar = ({
    counterParty
}) => {
    return (
        <UITopBar>
            {counterParty &&
                <UserInfo
                    name={counterParty.name}
                    avatar={counterParty.avatar}
                    userId={counterParty._id}
                    font-size="1.5rem"
                />
            }
        </UITopBar>
    )
}

export default TopBar;
