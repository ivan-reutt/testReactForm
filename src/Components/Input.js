import React from "react";

const Input = props => {
    const {field, name, required, disabled, value = ''} = props;
    return (
        <label className='text'>
            <input className='text__input'
                   type="text"
                   disabled={disabled}
                   value={value}
                   required={required}
                   onChange={(event) => props.onChange(event, name, field)}
            noValidate/>
            <p className="text__label">{name}: {required ? <span className="text__label_red">*</span>: ''}</p>

            {props.error ? props.error[name].length > 0 &&
            <span className='text__error'>{props.error[name]}</span> : ''}
        </label>
    )

}



export default Input;