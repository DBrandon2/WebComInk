import React from 'react';
import { READING_MODES } from '../utils/constants';

export default function PageIndicator({ 
  readingMode, 
  currentPageIndex, 
  totalPages 
}) {
  const getPageText = () => {
    if (readingMode === READING_MODES.WEBTOON) {
      return `Page ${currentPageIndex + 1} / ${totalPages}`;
    } else if (readingMode === READING_MODES.MANGA) {
      return `Page ${totalPages - currentPageIndex + 1} / ${totalPages + 1}`;
    } else {
      return `Page ${currentPageIndex + 1} / ${totalPages + 1}`;
    }
  };

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 bg-dark-bg/80 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium">
      {getPageText()}
    </div>
  );
} 