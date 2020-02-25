import React from "react";
import Select from 'react-select';

import options from "./selectOptions";

const Selected = (props) => {
    const { isDisabled, value, error, onChange, onClick} = props;
    return (
        <div className="select">
            <p className={`select__label ${isDisabled ? '' : 'disabled'}`}>
                Wireless Network Name: <span className="text__label_red">*</span></p>
            {error ?
                <span className='text__error'>{error}</span> : ''}
            <Select options={options}
                    isDisabled={!isDisabled}
                    className={'select__container'}
                    value={value}
                    onChange={onChange}
                    placeholder={'Please select'}
                    classNamePrefix={'select'}/>
            <button type={'button'}
                    disabled={!isDisabled}
                    onClick={onClick}
                    className={`select__button ${isDisabled ? '' : 'disabled'}`}>&#8635;</button>
        </div>
    )
}

export default Selected;