import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Minus } from "lucide-react";

export default function FilterGenreBtn({
  isOpen,
  onClose,
  selectedGenres,
  excludedGenres,
  onGenreChange,
}) {
  const genres = [
    "Action",
    "Aventure",
    "Comédie",
    "Drame",
    "Fantasy",
    "Horreur",
    "Romance",
    "Science-Fiction",
    "Thriller",
    "Mystère",
    "Slice of Life",
    "Surnaturel",
    "Historique",
    "Sport",
    "Mecha",
    "Ecchi",
    "Yaoi",
    "Yuri",
    "Josei",
    "Seinen",
    "Shoujo",
    "Shounen",
    "Isekai",
    "Martial Arts",
  ];

  const [tempSelectedGenres, setTempSelectedGenres] = useState(selectedGenres);
  const [tempExcludedGenres, setTempExcludedGenres] = useState(excludedGenres);

  // Fonction pour déterminer l'état d'un genre
  const getGenreState = (genre) => {
    if (tempSelectedGenres.includes(genre)) return "included";
    if (tempExcludedGenres.includes(genre)) return "excluded";
    return "none";
  };

  const handleGenreToggle = (genre) => {
    const currentState = getGenreState(genre);

    // Cycle: none -> included -> excluded -> none
    switch (currentState) {
      case "none":
        // Ajouter aux inclus
        setTempSelectedGenres((prev) => [...prev, genre]);
        break;
      case "included":
        // Retirer des inclus et ajouter aux exclus
        setTempSelectedGenres((prev) => prev.filter((g) => g !== genre));
        setTempExcludedGenres((prev) => [...prev, genre]);
        break;
      case "excluded":
        // Retirer des exclus (retour à none)
        setTempExcludedGenres((prev) => prev.filter((g) => g !== genre));
        break;
    }
  };

  const handleApply = () => {
    onGenreChange({
      included: tempSelectedGenres,
      excluded: tempExcludedGenres,
    });
    onClose();
  };

  const handleReset = () => {
    setTempSelectedGenres([]);
    setTempExcludedGenres([]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
            className="fixed bottom-0 left-0 right-0 bg-dark-bg border-t border-accent z-50 max-h-[80vh] md:hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-accent-hover">
              <h3 className="text-xl font-semibold text-accent">
                Filtrer par genre
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-accent-hover rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto max-h-[50vh]">
              <div className="grid grid-cols-2 gap-3">
                {genres.map((genre) => {
                  const state = getGenreState(genre);
                  return (
                    <motion.button
                      key={genre}
                      onClick={() => handleGenreToggle(genre)}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                        state === "included"
                          ? "bg-green-600 text-white border-green-500"
                          : state === "excluded"
                          ? "bg-red-600 text-white border-red-500"
                          : "bg-accent-hover text-gray-300 border-gray-600 hover:border-accent"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-sm font-medium">{genre}</span>
                      {state === "included" && <Check className="w-4 h-4" />}
                      {state === "excluded" && <X className="w-4 h-4" />}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-accent-hover bg-dark-bg">
              <div className="flex gap-3">
                <motion.button
                  onClick={handleReset}
                  className="flex-1 py-3 px-4 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-500 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Réinitialiser
                </motion.button>
                <motion.button
                  onClick={handleApply}
                  className="flex-1 py-3 px-4 bg-accent text-dark-bg rounded-lg font-medium hover:bg-accent-hover transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Appliquer (
                  {tempSelectedGenres.length + tempExcludedGenres.length})
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
