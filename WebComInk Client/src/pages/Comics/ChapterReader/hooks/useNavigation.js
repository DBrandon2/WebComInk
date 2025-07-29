import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { READING_MODES } from '../utils/constants';

export const useNavigation = (
  mangaId, 
  slug, 
  chapterId, 
  allChapters, 
  currentChapterIndex,
  chapterImages,
  readingMode
) => {
  const navigate = useNavigate();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // Navigation entre chapitres
  const goToPreviousChapter = () => {
    if (currentChapterIndex < allChapters.length - 1) {
      const prevChapter = allChapters[currentChapterIndex + 1];
      navigate(`/Comics/${mangaId}/${slug}/chapter/${prevChapter.id}`);
    }
  };

  const goToNextChapter = () => {
    if (currentChapterIndex > 0) {
      const nextChapter = allChapters[currentChapterIndex - 1];
      navigate(`/Comics/${mangaId}/${slug}/chapter/${nextChapter.id}`);
    }
  };

  const goToChapter = (chapterId) => {
    navigate(`/Comics/${mangaId}/${slug}/chapter/${chapterId}`);
  };

  // Navigation entre pages
  const goToNextPage = () => {
    const maxPage = readingMode === READING_MODES.WEBTOON 
      ? chapterImages.length - 1 
      : chapterImages.length;
    
    if (currentPageIndex < maxPage) {
      setCurrentPageIndex(currentPageIndex + 1);
    } else {
      goToNextChapter();
    }
  };

  const goToPreviousPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    } else {
      goToPreviousChapter();
    }
  };

  // Reset de l'index de page lors du changement de chapitre
  useEffect(() => {
    setCurrentPageIndex(0);
  }, [chapterId]);

  // Initialisation currentPageIndex en mode manga
  useEffect(() => {
    if (readingMode === READING_MODES.MANGA) {
      setCurrentPageIndex(chapterImages.length - 1);
    } else {
      setCurrentPageIndex(0);
    }
  }, [chapterId, readingMode, chapterImages.length]);

  return {
    currentPageIndex,
    setCurrentPageIndex,
    goToPreviousChapter,
    goToNextChapter,
    goToChapter,
    goToNextPage,
    goToPreviousPage,
  };
};