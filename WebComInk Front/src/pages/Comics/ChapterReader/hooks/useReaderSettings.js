import { useState, useEffect } from 'react';
import { 
  getReaderSettingsMode, 
  getMangaIdFromPath, 
  getStoredReaderMargin, 
  getStoredReadingMode,
  saveReaderMargin,
  saveReadingMode 
} from '../utils/readerUtils';

export const useReaderSettings = () => {
  const readerSettingsMode = getReaderSettingsMode();
  const mangaId = getMangaIdFromPath();

  const [readerMargin, setReaderMargin] = useState(() => 
    getStoredReaderMargin(mangaId, readerSettingsMode)
  );

  const [readingMode, setReadingMode] = useState(() => 
    getStoredReadingMode(mangaId, readerSettingsMode)
  );

  // Sauvegarder la marge
  useEffect(() => {
    saveReaderMargin(readerMargin, mangaId, readerSettingsMode);
  }, [readerMargin, readerSettingsMode, mangaId]);

  // Sauvegarder le mode de lecture
  useEffect(() => {
    saveReadingMode(readingMode, mangaId, readerSettingsMode);
  }, [readingMode, readerSettingsMode, mangaId]);

  return {
    readerMargin,
    setReaderMargin,
    readingMode,
    setReadingMode,
    readerSettingsMode,
  };
};