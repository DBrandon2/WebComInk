import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, Pause, Clock, CheckCircle } from "lucide-react";

const categories = [
  {
    key: "en-cours",
    label: "En cours",
    description: "Manga que vous lisez actuellement",
    icon: BookOpen,
    color: "bg-blue-500",
  },
  {
    key: "en-pause",
    label: "En pause",
    description: "Manga mis en pause temporairement",
    icon: Pause,
    color: "bg-orange-500",
  },
  {
    key: "a-lire",
    label: "À lire",
    description: "Manga que vous voulez lire plus tard",
    icon: Clock,
    color: "bg-purple-500",
  },
  {
    key: "lu",
    label: "Lu",
    description: "Manga que vous avez terminé",
    icon: CheckCircle,
    color: "bg-green-500",
  },
];

export default function CategorySelectionModal({
  isOpen,
  onClose,
  onSelectCategory,
  mangaTitle,
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
            className="relative bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Ajouter aux favoris
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Choisissez une catégorie pour "{mangaTitle}"
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
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <motion.button
                    key={category.key}
                    onClick={() => handleCategorySelect(category.key)}
                    className="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-accent hover:bg-accent/5 transition-all duration-200 text-left group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${category.color} text-white group-hover:scale-110 transition-transform`}
                      >
                        <IconComponent size={20} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-accent transition-colors">
                          {category.label}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={onClose}
                className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Annuler
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}