import React, {useState} from 'react';

const RadiusSelector = ({onChange}) => {

    const [selectedOption, setSelectedOption] = useState("");

    const handleChange = (e) => {
        const value = Number(e.target.value);
        setSelectedOption(value);
        if (onChange) onChange(value);
    }
    return (
        
        <select
            value={selectedOption}
            onChange={handleChange}
        >
            <option value="">Select a Search Radius</option>
            <option value="">None</option>
            <option value="10">10 km</option>
            <option value="20">20 km</option>
            <option value="50">50 km</option>
            <option value="100">100 km</option>
            <option value="200">200 km</option>
        </select>
    ) 
}

export default RadiusSelector;