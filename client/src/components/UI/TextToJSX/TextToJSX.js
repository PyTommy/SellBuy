import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styles from './TextToJSX.module.scss';


const TextToJSX = ({
    children,
    style,
    className
}) => {
    const appliedClasses = [styles.line, className].join(" ");
    const paragraphArray = children.split("\n");
    const len = paragraphArray.len;
    const paragraphsJSX = children.split("\n").map((line, i) => (
        <Fragment key={i}>
            <span
                style={style}
                className={appliedClasses}
            >{line}
            </span>
            {i !== len - 1 && <br />}
        </Fragment>
    ));

    return paragraphsJSX;
};

TextToJSX.propTypes = ({
    children: PropTypes.string.isRequired,
});

export default TextToJSX;
