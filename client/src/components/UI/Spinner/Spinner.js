import React from 'react';
import Loader from 'react-loader-spinner'


export default ({
    style = {},
    type = "TailSpin",
    size = 50,
    color = "#0084FF",
    timeout = 0,
    center = false,
}) => {
    let centeredStyle = {};
    if (center) {
        centeredStyle = {
            position: "fixed",
            width: "100vw",
            height: "100vw",
            display: "flex",
            alignItems: 'center',
            justifyContent: 'center',
        };
    };
    return (
        <div
            style={{
                ...style,
                width: "100%",
                textAlign: "center",
                ...centeredStyle
            }}
        >
            <Loader
                type={type}
                color={color}
                height={size}
                width={size}
                timeout={timeout} //3 secs
            />
        </div>
    )
};