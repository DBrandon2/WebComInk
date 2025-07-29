import React from 'react';
import { motion } from 'framer-motion';
import { READING_MODES } from '../utils/constants';

export default function SimpleProgressBar({
  currentPage,
  totalPages,
  showHeader,
  readingMode,
}) {
  // Si on est sur la dernière page (page de changement de chapitre), la barre est à 100%
  // Sinon, calcul normal
  const isOnLastPage = currentPage === totalPages;
  
  let progress;
  if (isOnLastPage) {
    progress = 100;
  } else if (readingMode === READING_MODES.MANGA) {
    // Mode manga : progression inversée (de droite à gauche)
    progress = totalPages > 0 ? ((totalPages - currentPage + 1) / totalPages) * 100 : 0;
  } else {
    // Mode comics : progression normale (de gauche à droite)
    progress = totalPages > 0 ? (currentPage / totalPages) * 100 : 0;
  }

  if (!showHeader) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-0 left-0 right-0 z-30"
    >
      <div className="w-full h-1 bg-gray-700">
        <motion.div
          className="bg-accent h-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
} 