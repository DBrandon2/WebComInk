import { useEffect } from 'react';
import { READING_MODES } from '../utils/constants';

export const useKeyboardNavigation = (
  readingMode,
  currentPageIndex,
  chapterImages,
  goToPreviousChapter,
  goToNextChapter,
  goToNextPage,
  goToPreviousPage,
  setShowChapterSelector
) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignorer si on est dans un input
      if (e.target.tagName === "INPUT") return;

      if (readingMode === READING_MODES.WEBTOON) {
        // Mode webtoon : navigation verticale
        if (e.key === "ArrowDown" || e.key === "PageDown") {
          e.preventDefault();
          window.scrollBy({
            top: window.innerHeight * 0.8,
            behavior: "smooth",
          });
        } else if (e.key === "ArrowUp" || e.key === "PageUp") {
          e.preventDefault();
          window.scrollBy({
            top: -window.innerHeight * 0.8,
            behavior: "smooth",
          });
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          goToPreviousChapter();
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          goToNextChapter();
        }
      } else {
        // Modes manga et comics : navigation page par page
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          if (readingMode === READING_MODES.MANGA) {
            goToNextPage(); // Manga : gauche = suivant
          } else {
            goToPreviousPage(); // Comics : gauche = précédent
          }
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          if (readingMode === READING_MODES.MANGA) {
            goToPreviousPage(); // Manga : droite = précédent
          } else {
            goToNextPage(); // Comics : droite = suivant
          }
        } else if (e.key === "ArrowUp" || e.key === "PageUp") {
          e.preventDefault();
          goToPreviousPage();
        } else if (e.key === "ArrowDown" || e.key === "PageDown") {
          e.preventDefault();
          goToNextPage();
        }
      }

      if (e.key === "c" || e.key === "C") {
        e.preventDefault();
        setShowChapterSelector(true);
      } else if (e.key === "Escape") {
        setShowChapterSelector(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    readingMode,
    currentPageIndex,
    chapterImages.length,
    goToPreviousChapter,
    goToNextChapter,
    goToNextPage,
    goToPreviousPage,
    setShowChapterSelector,
  ]);
};