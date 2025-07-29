import { useState } from 'react';
import { useDrag } from '@use-gesture/react';
import { READING_MODES } from '../utils/constants';
import { isNearBottom } from '../utils/readerUtils';

export const useGestures = ({
  readingMode,
  allChapters,
  currentChapterIndex,
  goToNextChapter,
  isMobile,
  maxPull = 120,
  triggerPull = 100,
  SCROLL_TOLERANCE = 24,
  currentPageIndex,
  chapterImages,
  goToNextPage,
  goToPreviousPage,
  SWIPE_THRESHOLD = 80,
  x,
  controls,
}) => {
  const [pullHeight, setPullHeight] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Pull-to-refresh pour le mode webtoon
  const bindPullToRefresh = useDrag(
    ({ down, movement: [, my], last }) => {
      if (!isMobile || readingMode !== READING_MODES.WEBTOON) return;
      
      if (!isNearBottom(SCROLL_TOLERANCE)) {
        if (pullHeight !== 0) setPullHeight(0);
        return;
      }

      if (down && my < 0) {
        const resistance = -my / 2;
        setPullHeight(Math.max(0, Math.min(maxPull, resistance)));
      } else if (last) {
        if (
          pullHeight >= triggerPull &&
          allChapters &&
          currentChapterIndex > 0
        ) {
          const nextChapter = allChapters[currentChapterIndex - 1];
          if (nextChapter) {
            setPullHeight(0);
            goToNextChapter();
            return;
          }
        }
        setPullHeight(0);
      }
    },
    { 
      pointer: { touch: true }, 
      enabled: isMobile && readingMode === READING_MODES.WEBTOON 
    }
  );

  // Swipe gestures pour les modes manga et comics
  const bindSwipe = useDrag(
    ({ down, movement: [mx], last }) => {
      if (!isMobile || readingMode === READING_MODES.WEBTOON) return;
      
      setIsDragging(down);
      x.set(down ? mx : 0);
      if (down) return;

      if (Math.abs(mx) > SWIPE_THRESHOLD) {
        if (mx < 0) {
          // Swipe gauche → page suivante (manga = droite, comics = droite)
          if (
            (readingMode === READING_MODES.MANGA && currentPageIndex > 0) ||
            (readingMode !== READING_MODES.MANGA && currentPageIndex < chapterImages.length - 1)
          ) {
            controls
              .start({
                x: -window.innerWidth,
                opacity: 0,
                transition: { duration: 0.18, ease: "linear" },
              })
              .then(() => {
                x.set(0);
                if (readingMode === READING_MODES.MANGA) {
                  goToPreviousPage();
                } else {
                  goToNextPage();
                }
                controls.set({ x: window.innerWidth, opacity: 0 });
                controls.start({
                  x: 0,
                  opacity: 1,
                  transition: { duration: 0.18, ease: "linear" },
                });
              });
          } else {
            controls.start({
              x: 0,
              transition: { duration: 0.18, ease: "linear" },
            });
          }
        } else {
          // Swipe droite → page précédente (manga = gauche, comics = gauche)
          if (
            (readingMode === READING_MODES.MANGA && currentPageIndex < chapterImages.length - 1) ||
            (readingMode !== READING_MODES.MANGA && currentPageIndex > 0)
          ) {
            controls
              .start({
                x: window.innerWidth,
                opacity: 0,
                transition: { duration: 0.18, ease: "linear" },
              })
              .then(() => {
                x.set(0);
                if (readingMode === READING_MODES.MANGA) {
                  goToNextPage();
                } else {
                  goToPreviousPage();
                }
                controls.set({ x: -window.innerWidth, opacity: 0 });
                controls.start({
                  x: 0,
                  opacity: 1,
                  transition: { duration: 0.18, ease: "linear" },
                });
              });
          } else {
            controls.start({
              x: 0,
              transition: { duration: 0.18, ease: "linear" },
            });
          }
        }
      } else {
        controls.start({
          x: 0,
          transition: { duration: 0.18, ease: "linear" },
        });
      }
    },
    { pointer: { touch: true }, enabled: isMobile }
  );

  return {
    bind: bindPullToRefresh,
    bindSwipe,
    pullHeight,
    isDragging,
  };
};

export const useCarouselDrag = (
  readingMode,
  currentPageIndex,
  chapterImages,
  goToNextPage,
  goToPreviousPage,
  goToNextChapter
) => {
  const [dragX, setDragX] = useState(0);

  const handleDrag = (event, info) => {
    setDragX(info.offset.x);
  };

  const handleDragEnd = (event, info) => {
    const offset = info.offset.x;
    const pageWidth = window.innerWidth;
    let newIdx = currentPageIndex;
    const maxPage = readingMode === READING_MODES.WEBTOON 
      ? chapterImages.length - 1 
      : chapterImages.length;

    if (Math.abs(offset) > pageWidth * 0.18) {
      if (readingMode === READING_MODES.MANGA) {
        if (offset > 0) {
          if (currentPageIndex === 0) {
            goToNextChapter();
            return;
          } else {
            newIdx = currentPageIndex - 1;
          }
        } else {
          if (currentPageIndex >= chapterImages.length - 1) {
            goToNextChapter();
            return;
          } else {
            newIdx = currentPageIndex + 1;
          }
        }
      } else {
        if (offset < 0) {
          if (currentPageIndex >= maxPage) {
            goToNextChapter();
            return;
          } else {
            newIdx = currentPageIndex + 1;
          }
        } else {
          if (currentPageIndex <= 0) {
            return;
          } else {
            newIdx = currentPageIndex - 1;
          }
        }
      }
    }

    return newIdx;
  };

  return {
    dragX,
    handleDrag,
    handleDragEnd,
  };
};