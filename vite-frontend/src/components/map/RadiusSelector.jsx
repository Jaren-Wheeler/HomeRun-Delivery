import React, { useState } from "react";

export default function RadiusSelector({ onChange }) {
  const [selectedOption, setSelectedOption] = useState("");

  const handleChange = (e) => {
    const value = e.target.value === "" ? null : Number(e.target.value);
    setSelectedOption(e.target.value);
    if (onChange) onChange(value);
  };

  return (
    <div className="relative">
      <select
        value={selectedOption}
        onChange={handleChange}
        className="
          block
          w-44
          appearance-none
          rounded-md
          border border-gray-300
          bg-white
          px-3 py-2
          text-gray-800
          shadow-sm
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-500
          cursor-pointer
        "
      >
        {/* Placeholder */}
        <option value="" disabled className="text-gray-500 bg-white">
          Select Radius
        </option>

        <option value="10">10 km</option>
        <option value="20">20 km</option>
        <option value="50">50 km</option>
        <option value="100">100 km</option>
        <option value="200">200 km</option>
      </select>

      {/* Chevron arrow */}
      <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-500">
        ▼
      </div>
    </div>
  );
}
