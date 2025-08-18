import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import {
  addFavorite,
  removeFavorite,
  checkIsFavorite,
} from "../services/favoriteService";
import { toast } from "react-hot-toast";
import { LuBookPlus } from "react-icons/lu";
import { LuBookmarkX } from "react-icons/lu";
import { motion } from "framer-motion";
import CategorySelectionModal from "./modals/CategorySelectionModal";

export default function FavoriteButton({
  mangaId,
  title,
  coverImage,
  customCategories = [],
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const status = await checkIsFavorite(mangaId);
        setIsFavorite(status);
      } catch (error) {}
    };

    if (mangaId) {
      checkFavoriteStatus();
    }
  }, [mangaId]);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!mangaId || !title) {
      // toast.error("Informations du manga incomplètes");
      return;
    }

    if (isFavorite) {
      // Si déjà en favori, on supprime directement
      setIsLoading(true);
      try {
        await removeFavorite(mangaId);
        setIsFavorite(false);
        toast.success("Retiré des favoris");
      } catch (error) {
        toast.error(error.message || "Une erreur est survenue");
      } finally {
        setIsLoading(false);
      }
    } else {
      // Si pas en favori, on ouvre le modal de sélection de catégorie
      setShowCategoryModal(true);
    }
  };

  const handleCategorySelect = async (category) => {
    setIsLoading(true);
    try {
      await addFavorite(
        mangaId,
        title,
        coverImage,
        category || customCategories[0] || "non-classé"
      );
      setIsFavorite(true);
    } catch (error) {
      toast.error(error.message || "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={handleToggleFavorite}
        disabled={isLoading}
        className={`flex items-center gap-2 px-3 py-3 rounded-md font-semibold text-sm cursor-pointer border border-accent
          ${
            isFavorite
              ? "bg-accent text-dark-bg hover:bg-accent/80"
              : "hover:bg-accent-hover"
          }
          ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.93 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
      >
        {isFavorite ? <LuBookmarkX size={20} /> : <LuBookPlus size={20} />}
        <span>
          {isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        </span>
      </motion.button>

      <CategorySelectionModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSelectCategory={handleCategorySelect}
        mangaTitle={title}
        customCategories={customCategories}
      />
    </>
  );
}
