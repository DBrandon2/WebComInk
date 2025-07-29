import { useState, useRef } from 'react';
import { useDrag } from '@use-gesture/react';
import { useMotionValue, useAnimation } from 'framer-motion';
import { 
  SWIPE_THRESHOLD, 
  SCROLL_TOLERANCE, 
  MAX_PULL, 
  TRIGGER_PULL,
  READING_MODES 
} from '../utils/constants';
import { isMobileDevice, isNearBottom } from '../utils/readerUtils';

export const usePullToRefresh = (
  readingMode,
  allChapters,
  currentChapterIndex,
  goToNextChapter
) => {
  const [pullHeight, setPullHeight] = useState(0);
  const isMobile = isMobileDevice();

  const bind = useDrag(
    ({ down, movement: [, my], last }) => {
      if (!isMobile || readingMode !== READING_MODES.WEBTOON) return;
      
      if (!isNearBottom(SCROLL_TOLERANCE)) {
        if (pullHeight !== 0) setPullHeight(0);
        return;
      }

      if (down && my < 0) {
        const resistance = -my / 2;
        setPullHeight(Math.max(0, Math.min(MAX_PULL, resistance)));
      } else if (last) {
        if (
          pullHeight >= TRIGGER_PULL &&
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

  return { bind, pullHeight };
};

export const useSwipeGestures = (
  readingMode,
  currentPageIndex,
  chapterImages,
  goToNextPage,
  goToPreviousPage
) => {
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const controls = useAnimation();
  const isMobile = isMobileDevice();

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
          // Swipe droite → page précédente
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
    bindSwipe,
    isDragging,
    x,
    controls,
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