import React from 'react'
import classes from './Input.module.scss';

const Input = ({
    id,
    type,
    placeholder,
    value = "",
    onChange,
    name,
    required = false,
    className,
    style,
    children
}) => {
    let input;
    if (type === "textarea") {
        input = (<textarea
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            name={name}
            required={required}
            className={[classes.Textarea, className].join(" ")}
            style={style}
        />);

    } else if (type === "select") {
        input = (<select
            value={value}
            onChange={onChange}
            name={name}
            required={required}
            className={[classes.Input, className].join(" ")}
            style={style}
        >{children}</select>);
    } else {
        input = (<input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            name={name}
            required={required}
            className={[classes.Input, className].join(" ")}
            style={style}
        />);
    }

    return input;
}

export default Input;
