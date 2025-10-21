// Constantes pour le lecteur de chapitres
export const READING_MODES = {
  WEBTOON: 'webtoon',
  MANGA: 'manga',
  COMICS: 'comics'
};

export const READING_MODE_OPTIONS = [
  { value: READING_MODES.WEBTOON, label: "Webtoon (vertical)" },
  { value: READING_MODES.MANGA, label: "Manga (droite → gauche)" },
  { value: READING_MODES.COMICS, label: "Comics (gauche → droite)" },
];

export const SWIPE_THRESHOLD = 80;
export const SCROLL_TOLERANCE = 24;
export const MAX_PULL = 120;
export const TRIGGER_PULL = 100;
export const CIRCLE_STEP = 34;

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const READER_SETTINGS_MODE = {
  GLOBAL: 'global',
  PER_MANGA: 'per-manga'
};

export const IMAGE_QUALITY = {
  DATA: 'data',
  DATA_SAVER: 'data-saver'
};