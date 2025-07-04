import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Minus } from "lucide-react";

import { getAllTags, getMangas } from "../services/mangaService";

export default function FilterGenreBtn({
  isOpen,
  onClose,
  selectedGenres,
  excludedGenres,
  onGenreChange,
  selectedYear,
  onYearChange,
  sortDate,
  onSortDateChange,
}) {
  const [allTags, setAllTags] = useState([]);
  const [loadingTags, setLoadingTags] = useState(false);
  const [errorTags, setErrorTags] = useState(null);

  // On charge tous les tags au montage du modal
  useEffect(() => {
    if (isOpen && allTags.length === 0) {
      setLoadingTags(true);
      getAllTags()
        .then((tags) => {
          setAllTags(tags);
          setLoadingTags(false);
        })
        .catch((err) => {
          setErrorTags("Erreur lors du chargement des tags");
          setLoadingTags(false);
        });
    }
  }, [isOpen, allTags.length]);

  const [tempSelectedGenres, setTempSelectedGenres] = useState(selectedGenres);
  const [tempExcludedGenres, setTempExcludedGenres] = useState(excludedGenres);

  // On stocke les IDs des tags sélectionnés/exclus
  const getTagState = (tagId) => {
    if (tempSelectedGenres.includes(tagId)) return "included";
    if (tempExcludedGenres.includes(tagId)) return "excluded";
    return "none";
  };

  const handleTagToggle = (tagId) => {
    const currentState = getTagState(tagId);
    switch (currentState) {
      case "none":
        setTempSelectedGenres((prev) => [...prev, tagId]);
        break;
      case "included":
        setTempSelectedGenres((prev) => prev.filter((g) => g !== tagId));
        setTempExcludedGenres((prev) => [...prev, tagId]);
        break;
      case "excluded":
        setTempExcludedGenres((prev) => prev.filter((g) => g !== tagId));
        break;
    }
  };

  const handleApply = () => {
    onGenreChange({
      included: tempSelectedGenres,
      excluded: tempExcludedGenres,
      year: selectedYear,
    });
    onClose();
  };

  const handleReset = () => {
    setTempSelectedGenres([]);
    setTempExcludedGenres([]);
  };

  // Liste des noms de tags à exclure (en anglais ou français)
  const excludedTagNames = [
    "Sexual Violence",
    "Violence sexuelle", // anglais/fr
    "Gore",
  ];

  // Regrouper les tags par groupe (genre, theme, format, content)
  const tagsByGroup = allTags.reduce((acc, tag) => {
    const name = tag.attributes.name;
    // Exclure les tags "Sexual Violence" et "Gore" (en/fr)
    if (
      (name?.en && excludedTagNames.includes(name.en)) ||
      (name?.fr && excludedTagNames.includes(name.fr))
    ) {
      return acc;
    }
    const group = tag.attributes.group || "Autre";
    if (!acc[group]) acc[group] = [];
    acc[group].push(tag);
    return acc;
  }, {});

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
                Filtres avancés
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
              {loadingTags && (
                <div className="text-accent">Chargement des tags...</div>
              )}
              {errorTags && <div className="text-red-500">{errorTags}</div>}
              {!loadingTags &&
                !errorTags &&
                Object.entries(tagsByGroup).map(([group, tags]) => (
                  <div key={group} className="mb-4">
                    <div className="font-semibold text-accent mb-2 capitalize">
                      {group}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {tags.map((tag) => {
                        const state = getTagState(tag.id);
                        return (
                          <motion.button
                            key={tag.id}
                            onClick={() => handleTagToggle(tag.id)}
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
                            <span className="text-sm font-medium">
                              {tag.attributes.name.fr ||
                                tag.attributes.name.en ||
                                tag.attributes.name.ja ||
                                Object.values(tag.attributes.name)[0] ||
                                "Tag"}
                            </span>
                            {state === "included" && (
                              <Check className="w-4 h-4" />
                            )}
                            {state === "excluded" && <X className="w-4 h-4" />}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                ))}
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
