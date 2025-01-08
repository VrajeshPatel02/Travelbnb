"use client"

import React from 'react';

interface CheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
  className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ 
  id, 
  label, 
  checked, 
  onChange, 
  className = '' 
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
      />
      <label
        htmlFor={id}
        className="ml-2 text-sm font-medium text-gray-900 cursor-pointer"
      >
        {label}
      </label>
    </div>
  );
};

export default Checkbox;