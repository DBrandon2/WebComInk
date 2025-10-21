import { READER_SETTINGS_MODE, IMAGE_QUALITY } from './constants';

// Utilitaires pour la gestion des paramètres localStorage
export const getReaderSettingsMode = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("readerSettingsMode") || READER_SETTINGS_MODE.GLOBAL;
  }
  return READER_SETTINGS_MODE.GLOBAL;
};

export const getMangaIdFromPath = () => {
  if (typeof window !== "undefined") {
    return window.location.pathname.split("/")[3];
  }
  return null;
};

export const getStoredReaderMargin = (mangaId, settingsMode) => {
  if (typeof window === "undefined") return 0;
  
  let val = 0;
  if (settingsMode === READER_SETTINGS_MODE.PER_MANGA && mangaId) {
    val = localStorage.getItem(`readerMargin_${mangaId}`);
  } else {
    val = localStorage.getItem("readerMargin");
  }
  
  if (val !== null && !isNaN(parseFloat(val))) {
    return Math.max(0, Math.min(100, parseFloat(val)));
  }
  return 0;
};

export const getStoredReadingMode = (mangaId, settingsMode) => {
  if (typeof window === "undefined") return "webtoon";
  
  let mode = "webtoon";
  if (settingsMode === READER_SETTINGS_MODE.PER_MANGA && mangaId) {
    mode = localStorage.getItem(`readingMode_${mangaId}`);
  } else {
    mode = localStorage.getItem("readingMode");
  }
  
  return mode && ["webtoon", "manga", "comics"].includes(mode) ? mode : "webtoon";
};

export const saveReaderMargin = (margin, mangaId, settingsMode) => {
  if (typeof window === "undefined") return;
  
  const val = Math.max(0, Math.min(100, margin));
  if (settingsMode === READER_SETTINGS_MODE.PER_MANGA && mangaId) {
    localStorage.setItem(`readerMargin_${mangaId}`, val.toString());
  } else {
    localStorage.setItem("readerMargin", val.toString());
  }
};

export const saveReadingMode = (mode, mangaId, settingsMode) => {
  if (typeof window === "undefined") return;
  
  if (settingsMode === READER_SETTINGS_MODE.PER_MANGA && mangaId) {
    localStorage.setItem(`readingMode_${mangaId}`, mode);
  } else {
    localStorage.setItem("readingMode", mode);
  }
};

export const getImageQuality = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("imageQuality") || IMAGE_QUALITY.DATA;
  }
  return IMAGE_QUALITY.DATA;
};

export const isMobileDevice = () => {
  return typeof window !== "undefined" && 
         window.matchMedia("(pointer: coarse)").matches;
};

export const buildImageUrl = (baseUrl, qualityPath, hash, filename) => {
  return `${baseUrl}/${qualityPath}/${hash}/${filename}`;
};

export const buildProxiedImageUrl = (apiBaseUrl, imageUrl) => {
  return `${apiBaseUrl}/proxy/image?url=${encodeURIComponent(imageUrl)}`;
};

export const calculateScrollProgress = () => {
  const scrollTop = window.pageYOffset;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  return docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
};

export const calculateSeriesProgress = (allChapters, currentChapterIndex) => {
  if (allChapters.length > 0 && currentChapterIndex >= 0) {
    return ((allChapters.length - currentChapterIndex - 1) / allChapters.length) * 100;
  }
  return 0;
};

export const isNearBottom = (tolerance = 24) => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  return docHeight - scrollTop <= tolerance;
};

export const formatChapterTitle = (title, maxWords = 8) => {
  if (!title) return '';
  const words = title.split(" ");
  return words.length > maxWords 
    ? words.slice(0, maxWords).join(" ") + "…" 
    : title;
};