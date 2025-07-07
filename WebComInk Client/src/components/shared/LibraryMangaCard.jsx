import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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
      className="group relative select-none "
      whileHover={{ scale: isDragging ? 1 : 1.03 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      tabIndex={-1}
    >
      <Link
        to={to}
        className="block focus:outline-none h-full select-none "
        tabIndex={0}
        draggable={false}
        style={isDragging ? { pointerEvents: "none" } : {}}
      >
        <div className="flex flex-col items-center gap-2 ">
          <motion.div
            className="w-[160px] h-[240px] lg:w-[220px] lg:h-[330px] 2xl:w-[185px] 2xl:h-[277px] relative overflow-hidden rounded-md bg-gray-200"
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <img
              src={coverUrl || "/default-cover.png"}
              alt={`${title} cover`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 select-none rounded-sm"
              loading="lazy"
              onError={(e) => {
                e.target.src = "/placeholder-manga.jpg";
              }}
            />

            {/* SUPPRIMÉ : Overlay avec boutons d'action (Edit3 et Trash2) */}

            {/* Dégradé + titre en bas de l'image */}
            <div className="absolute bottom-0 left-0 w-full p-2 pb-3 bg-gradient-to-t from-black/95 via-black/80 to-black/0 h-20 flex items-end">
              <h3 className="font-normal text-white text-xs md:text-sm lg:text-base line-clamp-2 drop-shadow-md">
                {title}
              </h3>
            </div>
          </motion.div>
        </div>

        {/* Content + lien */}
        <div className="p-3 select-none">
          {/* Titre supprimé ici */}
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
