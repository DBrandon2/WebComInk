import React from 'react';
import CustomSelect from '../../../../components/shared/CustomSelect';
import { READING_MODE_OPTIONS } from '../utils/constants';

export default function SettingsModal({
  isOpen,
  onClose,
  readingMode,
  setReadingMode,
  readerMargin,
  setReaderMargin,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="bg-dark-bg rounded-xl shadow-2xl p-6 w-full max-w-sm relative mx-2 flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-accent text-xl font-bold hover:text-white transition cursor-pointer"
          onClick={onClose}
          aria-label="Fermer"
        >
          ×
        </button>
        <h3 className="text-white text-lg font-semibold mb-6 mt-2">
          Paramètres du lecteur
        </h3>
        <div className="w-full space-y-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="readingMode"
              className="text-white font-medium text-sm mb-1"
            >
              Mode de lecture
            </label>
            <CustomSelect
              options={READING_MODE_OPTIONS}
              value={readingMode}
              onChange={setReadingMode}
              className="min-w-[220px] max-w-[520px] w-full"
            />
          </div>
          <SliderSetting
            label="Marge latérale"
            value={readerMargin}
            onChange={setReaderMargin}
            min={0}
            max={100}
            step={1}
            unit=""
            description="Ajuste l'espace sur les côtés des images (0 = aucune marge, 20 = image réduite à 30% de sa largeur)"
            formatValue={(val) => `${Math.round((val / 100) * 20)}/20`}
          />
        </div>
      </div>
    </div>
  );
}

function SliderSetting({
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