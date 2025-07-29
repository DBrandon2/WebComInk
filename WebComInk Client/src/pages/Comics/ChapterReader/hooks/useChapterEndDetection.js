import { useState, useEffect, useRef } from 'react';
import { READING_MODES } from '../utils/constants';

export const useChapterEndDetection = (
  currentPageIndex,
  totalPages,
  readingMode,
  onChapterEnd,
  onNearEnd
) => {
  const [isNearEnd, setIsNearEnd] = useState(false);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [hasTriggeredEnd, setHasTriggeredEnd] = useState(false);
  const nearEndThreshold = 3; // Pages avant la fin pour déclencher le préchargement
  const endThreshold = 1; // Page exacte de fin

  // Détecter si on est proche de la fin
  useEffect(() => {
    if (!totalPages) return;

    let nearEnd = false;
    let atEnd = false;

    if (readingMode === READING_MODES.WEBTOON) {
      // En mode webtoon, détecter selon la position de scroll
      const scrollPosition = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollPercentage = (scrollPosition + windowHeight) / documentHeight;
      
      nearEnd = scrollPercentage > 0.8; // 80% du scroll
      atEnd = scrollPercentage > 0.95; // 95% du scroll
    } else {
      // En mode manga/comics, détecter selon l'index de page
      const remainingPages = totalPages - currentPageIndex;
      nearEnd = remainingPages <= nearEndThreshold;
      atEnd = remainingPages <= endThreshold;
    }

    setIsNearEnd(nearEnd);
    setIsAtEnd(atEnd);

    // Déclencher le préchargement quand on est proche de la fin
    if (nearEnd && !hasTriggeredEnd) {
      onNearEnd?.();
      setHasTriggeredEnd(true);
    }

    // Déclencher la fin de chapitre
    if (atEnd && !hasTriggeredEnd) {
      onChapterEnd?.();
      setHasTriggeredEnd(true);
    }
  }, [currentPageIndex, totalPages, readingMode, onChapterEnd, onNearEnd, hasTriggeredEnd]);

  // Reset quand on change de chapitre
  useEffect(() => {
    setHasTriggeredEnd(false);
    setIsNearEnd(false);
    setIsAtEnd(false);
  }, [totalPages]);

  // Détecter la fin de lecture en mode webtoon
  useEffect(() => {
    if (readingMode !== READING_MODES.WEBTOON) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollPercentage = (scrollPosition + windowHeight) / documentHeight;
      
      if (scrollPercentage > 0.95 && !hasTriggeredEnd) {
        onChapterEnd?.();
        setHasTriggeredEnd(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [readingMode, onChapterEnd, hasTriggeredEnd]);

  return {
    isNearEnd,
    isAtEnd,
    hasTriggeredEnd,
    progress: totalPages ? (currentPageIndex / totalPages) * 100 : 0,
  };
}; 