import React from 'react'
import PropTypes from 'prop-types'
import Switcher from '../UI/Switcher/Switcher';

const MyList = props => {
    const buttons = [
        {
            text: "Likes",
            active: true,
            onClickHandler: () => { },
        },
        {
            text: "Purchased",
            active: false,
            onClickHandler: () => { }
        },
        {
            text: "Sellings",
            active: false,
            onClickHandler: () => { }
        }
    ];

    return (
        <div>
            <Switcher items={buttons} />
        </div>
    )
}

MyList.propTypes = {

}

export default MyList
