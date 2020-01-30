import React from 'react'
import classes from './Button.module.scss';
import Spinner from '../Spinner/Spinner';

const Button = ({
    children,
    className,
    style,
    onClick,
    btnType = "",
    loading = false
}) => {
    let spinnerSize = 15;
    let appliedClasses = [classes.Button];
    className && appliedClasses.push(className);

    // Colors
    btnType.includes("color-primary") && appliedClasses.push(classes.colorPrimary);
    btnType.includes("color-orange") && appliedClasses.push(classes.colorOrange);
    btnType.includes("color-danger") && appliedClasses.push(classes.colorDanger);
    btnType.includes("border-gray") && appliedClasses.push(classes.borderGray);

    // Size
    if (btnType.includes("size-sm")) {
        appliedClasses.push(classes.sizeSmall);
        spinnerSize = 10;
    }
    if (btnType.includes("size-lg")) {
        appliedClasses.push(classes.sizeLarge);
        spinnerSize = 20;
    }

    return (
        <button
            onClick={loading ? () => { } : onClick}
            style={style}
            className={appliedClasses.join(" ")}
        >
            {loading ? <Spinner size={spinnerSize} /> : children}
        </button>
    )
}

export default Button
