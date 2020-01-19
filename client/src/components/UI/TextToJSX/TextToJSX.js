import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styles from './TextToJSX.module.scss';


const TextToJSX = ({
    children,
    style,
    className
}) => {
    const appliedClasses = [styles.line, className].join(" ");

    return (
        <Fragment>
            {
                children.split("\n").map((line, i) => {
                    return (
                        <p
                            style={style}
                            className={appliedClasses}
                            key={i}
                        >{line}
                        </p>
                    );
                })
            }
        </Fragment>
    );
};

TextToJSX.propTypes = ({
    children: PropTypes.string.isRequired,
});

export default TextToJSX;
