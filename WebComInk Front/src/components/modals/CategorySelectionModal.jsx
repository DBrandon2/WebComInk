import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, Pause, Clock, CheckCircle } from "lucide-react";

export default function CategorySelectionModal({
  isOpen,
  onClose,
  onSelectCategory,
  mangaTitle,
  customCategories = [],
}) {
  if (!isOpen) return null;

  const handleCategorySelect = (categoryKey) => {
    onSelectCategory(categoryKey);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-dark-bg rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold">
                  Ajouter aux favoris
                </h2>
                <p className="text-sm mt-1 text-gray-400">
                  Choisissez une catégorie pour <span className="text-accent font-bold">"{mangaTitle}"</span>
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Categories */}
            <div className="p-6 space-y-3">
              {customCategories.length === 0 ? (
                <div className="text-center text-gray-500">
                  Aucune catégorie disponible.
                </div>
              ) : (
                customCategories.map((cat) => (
                  <motion.button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className="w-full p-4 rounded-lg border-2 border-white hover:border-accent hover:bg-accent/5 transition-all duration-200 text-left group cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-accent text-white group-hover:scale-110 transition-transform">
                        <BookOpen size={20} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold group-hover:text-accent transition-colors">
                          {cat}
                        </h3>
                      </div>
                    </div>
                  </motion.button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 bg-dark-bg">
              <motion.button
                onClick={onClose}
                className="w-full px-4 py-2 hover:bg-red-500/70 text-white hover:text-white border-2 rounded-lg border-white transition-colors cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Annuler
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
