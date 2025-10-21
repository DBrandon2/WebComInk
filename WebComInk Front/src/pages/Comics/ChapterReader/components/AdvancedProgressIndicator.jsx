import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Clock, TrendingUp } from 'lucide-react';

export default function AdvancedProgressIndicator({
  currentPage,
  totalPages,
  readingMode,
  readingProgress,
  chapterProgress,
  isNearEnd,
  isAtEnd,
  showDetails = false,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [estimatedTimeLeft, setEstimatedTimeLeft] = useState(null);

  // Calculer le temps restant estimé
  useEffect(() => {
    if (!currentPage || !totalPages) return;

    const pagesPerMinute = readingMode === 'webtoon' ? 8 : 4; // Estimation selon le mode
    const remainingPages = totalPages - currentPage;
    const minutesLeft = Math.ceil(remainingPages / pagesPerMinute);
    
    if (minutesLeft > 0) {
      setEstimatedTimeLeft(minutesLeft);
    }
  }, [currentPage, totalPages, readingMode]);

  // Afficher l'indicateur quand on est proche de la fin
  useEffect(() => {
    if (isNearEnd || isAtEnd) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isNearEnd, isAtEnd]);

  const progress = totalPages ? (currentPage / totalPages) * 100 : 0;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-dark-bg/90 backdrop-blur-sm border border-white/20 rounded-lg p-4 shadow-lg min-w-[300px]">
            {/* Barre de progression principale */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-sm font-medium">Progression</span>
                <span className="text-accent text-sm font-bold">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  className="bg-accent h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Informations détaillées */}
            {showDetails && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-300">
                  <div className="flex items-center gap-1">
                    <BookOpen size={12} />
                    <span>Page {currentPage} / {totalPages}</span>
                  </div>
                  {estimatedTimeLeft && (
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>~{estimatedTimeLeft} min restantes</span>
                    </div>
                  )}
                </div>

                {/* Progression globale */}
                <div className="flex items-center justify-between text-xs text-gray-300">
                  <div className="flex items-center gap-1">
                    <TrendingUp size={12} />
                    <span>Progression globale</span>
                  </div>
                  <span className="text-accent font-medium">
                    {Math.round(readingProgress)}%
                  </span>
                </div>
              </div>
            )}

            {/* Message spécial pour la fin */}
            {isAtEnd && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-3 p-2 bg-accent/20 border border-accent/30 rounded text-center"
              >
                <span className="text-accent text-sm font-medium">
                  🎉 Fin du chapitre atteinte !
                </span>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 