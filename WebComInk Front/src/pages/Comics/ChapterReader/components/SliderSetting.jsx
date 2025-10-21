import React from 'react';

export default function SliderSetting({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit = "",
  description,
  formatValue,
}) {
  const displayValue = formatValue ? formatValue(value) : `${value}${unit}`;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <label className="text-white font-medium text-sm">{label}</label>
        <span className="text-accent font-semibold text-sm">
          {displayValue}
        </span>
      </div>

      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #edf060 0%, #edf060 ${
              ((value - min) / (max - min)) * 100
            }%, #374151 ${((value - min) / (max - min)) * 100}%, #374151 100%)`,
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
            input[type="range"]::-webkit-slider-thumb {
              appearance: none;
              height: 18px;
              width: 18px;
              border-radius: 50%;
              background: #edf060;
              cursor: pointer;
              border: 2px solid #1f2937;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            }
            input[type="range"]::-moz-range-thumb {
              height: 18px;
              width: 18px;
              border-radius: 50%;
              background: #edf060;
              cursor: pointer;
              border: 2px solid #1f2937;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
              border: none;
            }
            input[type="range"]::-moz-range-track {
              background: transparent;
              border: none;
            }
          `,
          }}
        />
      </div>

      {description && (
        <p className="text-gray-400 text-xs mt-2">{description}</p>
      )}
    </div>
  );
} 