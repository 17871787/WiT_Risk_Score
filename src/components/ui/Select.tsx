import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[] | string[];
  className?: string;
  id?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  className = '',
  id
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };
  
  const normalizedOptions: SelectOption[] = options.map(option => 
    typeof option === 'string' 
      ? { value: option, label: option }
      : option
  );
  
  const selectId = id || `select-${label.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <div className={className}>
      <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <select
        id={selectId}
        name={selectId}
        value={value}
        onChange={handleChange}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {normalizedOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};