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

export default function FavoriteButton({ mangaId, title, coverImage }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const status = await checkIsFavorite(mangaId);
        setIsFavorite(status);
      } catch (error) {
        console.error(
          "Erreur lors de la vérification du statut favori:",
          error
        );
      }
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

    setIsLoading(true);

    try {
      if (isFavorite) {
        await removeFavorite(mangaId);
        // toast.success("Retiré des favoris");
      } else {
        await addFavorite(mangaId, title, coverImage);
        // toast.success("Ajouté aux favoris");
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      // toast.error(error.message || "Une erreur est survenue");
      console.error("Erreur lors de la modification des favoris:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
      whileTap={{ scale: 0.93 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
    >
      {isFavorite ? <LuBookmarkX size={20} /> : <LuBookPlus size={20} />}
      <span>{isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}</span>
    </motion.button>
  );
}
