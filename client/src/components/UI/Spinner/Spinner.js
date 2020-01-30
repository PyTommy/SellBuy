import React from 'react';
import Loader from 'react-loader-spinner'


export default ({ style = {}, type = "TailSpin", size = 50, color = "#0084FF", timeout = 0 }) => (
    <div
        style={{
            ...style,
            width: "100%",
            textAlign: "center",
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
);