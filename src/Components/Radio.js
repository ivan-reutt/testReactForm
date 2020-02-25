import React from "react";

const Radio = props => {
    const {field, name, value, text} = props
        return (
        <label className='radio'>
            <input className='radio__input'
                   type="radio"
                   onChange={() => props.onChange(name, field, value)}
                   disabled={props.disabled}
            checked={props.checked}/>
            <span className="radio__label">{text}</span>
        </label>
)
}

export default Radio;
