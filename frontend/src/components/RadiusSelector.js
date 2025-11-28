import React, {useState} from 'react';

const RadiusSelector = () => {

    const [selectedOption, setSelectedOption] = useState("");
    return (
        
        <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
        >
            <option value="">Select a Search Radius</option>
            <option value="10">10 km</option>
            <option value="20">20 km</option>
            <option value="50">50 km</option>
            <option value="100">100 km</option>
            <option value="200">2000 km</option>
        </select>
    ) 
}

export default RadiusSelector;