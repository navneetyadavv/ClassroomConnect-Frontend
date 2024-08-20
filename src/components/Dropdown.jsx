import React, { useState } from "react";

const Dropdown = ({ options, onSelect, selectedValue }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (option) => {
    onSelect(option);
    setIsOpen(false); 
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white border border-gray-300 p-2 rounded w-64" 
      >
        {selectedValue || "Select a subject"}
      </button>
      {isOpen && (
        <ul className="absolute bg-white border border-gray-300 mt-1 rounded shadow-lg w-64">
          {" "}
          {options.map((option) => (
            <li
              key={option}
              onClick={() => handleOptionClick(option)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
