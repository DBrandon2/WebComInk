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
  isDragging = false,
}) {
  return (
    <motion.div
      className="group relative select-none"
      whileHover={{ scale: isDragging ? 1 : 1.03 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      tabIndex={-1}
    >
      <Link
        to={to}
        className="block focus:outline-none h-full select-none"
        tabIndex={0}
        draggable={false}
        style={isDragging ? { pointerEvents: "none" } : {}}
      >
        <div className="flex flex-col items-center gap-2">
          <motion.div
            className="w-[160px] h-[240px] lg:w-[240px] lg:h-[360px] bg-gray-200 relative overflow-hidden"
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <img
              src={coverUrl || "/default-cover.png"}
              alt={`${title} cover`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 select-none"
              loading="lazy"
              onError={(e) => {
                e.target.src = "/placeholder-manga.jpg";
              }}
            />

            {/* Overlay avec boutons d'action */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 select-none">
              <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 select-none">
                <motion.button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onChangeCategory();
                  }}
                  className="p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors select-none"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Changer de catégorie"
                  tabIndex={-1}
                >
                  <Edit3 size={16} />
                </motion.button>
                <motion.button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onRemove(id);
                  }}
                  className="p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors select-none"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Retirer des favoris"
                  tabIndex={-1}
                >
                  <Trash2 size={16} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Content + lien */}
        <div className="p-3 select-none">
          <h3 className="font-medium text-accent line-clamp-2 text-sm md:text-base lg:text-lg cursor-pointer">
            {title}
          </h3>
          {authorName && (
            <span className="text-xs text-gray-400 md:text-sm line-clamp-1">
              {authorName}
            </span>
          )}
          {artistName && (
            <span className="text-xs text-gray-400 md:text-sm line-clamp-1">
              {artistName}
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
