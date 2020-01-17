import React from 'react'
import PropTypes from 'prop-types'

const Message = props => {
    return (
        <div>
            <b>{props.name}</b>
            <br />
            {props.text}
        </div>
    )
}

Message.propTypes = {

}

export default Message
