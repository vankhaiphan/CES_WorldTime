import React from 'react';
import './DatePickerItem.css';
import DatePicker from 'react-date-picker';

function DatePickerItem(props){
    const {startTime, onChange} = props;
    return(
        <DatePicker 
            onChange={onChange} 
            value={startTime} 
            clearIcon={null} 
        />
    )
}

export default DatePickerItem;