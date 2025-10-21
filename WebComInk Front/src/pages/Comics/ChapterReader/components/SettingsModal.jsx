import React from 'react';
import CustomSelect from '../../../../components/shared/CustomSelect';
import ReadingModeSelector from './ReadingModeSelector';
import SliderSetting from './SliderSetting';
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
            <ReadingModeSelector
              value={readingMode}
              onChange={setReadingMode}
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