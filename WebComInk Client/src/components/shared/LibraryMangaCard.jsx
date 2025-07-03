import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trash2, Edit3 } from "lucide-react";

export default function LibraryMangaCard({
  id,
  title,
  coverUrl,
  authorName,
  artistName,
  to,
  onRemove,
  onChangeCategory,
}) {
  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove(id);
  };

  const handleChangeCategory = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onChangeCategory();
  };

  return (
    <motion.div
      className="group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={to} className="block">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-200">
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.target.src = "/placeholder-manga.jpg";
            }}
          />
          
          {/* Overlay avec boutons d'action */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300">
            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <motion.button
                onClick={handleChangeCategory}
                className="p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Changer de catégorie"
              >
                <Edit3 size={16} />
              </motion.button>
              
              <motion.button
                onClick={handleRemove}
                className="p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Retirer des favoris"
              >
                <Trash2 size={16} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1 group-hover:text-accent transition-colors">
            {title}
          </h3>
          
          {(authorName || artistName) && (
            <div className="text-xs text-gray-600 space-y-0.5">
              {authorName && (
                <p className="line-clamp-1">
                  <span className="font-medium">Auteur:</span> {authorName}
                </p>
              )}
              {artistName && artistName !== authorName && (
                <p className="line-clamp-1">
                  <span className="font-medium">Artiste:</span> {artistName}
                </p>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}