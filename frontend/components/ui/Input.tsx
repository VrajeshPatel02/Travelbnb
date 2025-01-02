import React from "react";

interface InputProps {
  type: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({
  type,
  name,
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
}) => {
  return (
    <div className="w-full mb-5">
      <input
        className={`w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border ${
          error ? "border-red-500" : "border-gray-200"
        } placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white`}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
