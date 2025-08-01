import React, { useCallback } from 'react';
import { validateNumericInput } from '../../lib/utils/validation';

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit?: string;
  showValue?: boolean;
  decimals?: number;
  warning?: { threshold: number; message: string };
  info?: string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit = '',
  showValue = true,
  decimals = 1,
  warning,
  info
}) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = validateNumericInput(e.target.value, min, max, decimals);
    onChange(newValue);
  }, [onChange, min, max, decimals]);
  
  const displayValue = decimals === 0 ? 
    Math.round(value) : 
    value.toFixed(decimals);
  
  const showWarning = warning && value > warning.threshold;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
        {showValue && (
          <span className="text-sm font-semibold text-gray-900">
            {displayValue}{unit}
          </span>
        )}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="w-full"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
      {showWarning && (
        <div className="text-xs text-orange-600 mt-1">⚠ {warning.message}</div>
      )}
      {info && (
        <div className="text-xs text-gray-600 mt-1">{info}</div>
      )}
    </div>
  );
};