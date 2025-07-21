import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trash2, Edit3 } from "lucide-react";

export default function LibraryMangaCard({
  id,
  to,
  coverUrl,
  title,
  authorName,
  artistName,
  onRemove,
  onChangeCategory,
  isDragging = false,
  index,
}) {
  // On force le placeholder pour la première carte
  const showPlaceholder = index === 0 || !coverUrl;
  return (
    <motion.div
      className={"group relative select-none will-change-transform"}
      whileHover={{ scale: isDragging ? 1 : 1.03 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      tabIndex={-1}
      style={isDragging ? { transform: "scale(1)" } : {}}
    >
      {/* LOG : coverUrl utilisé */}
      {console.log(
        "[LibraryMangaCard] coverUrl utilisé :",
        coverUrl,
        "pour",
        title
      )}
      <Link
        to={to}
        className="block focus:outline-none h-full select-none"
        tabIndex={-1}
        style={isDragging ? { pointerEvents: "none" } : {}}
      >
        <div className="flex flex-col items-center gap-2">
          <motion.div
            className="w-full aspect-[2/3] bg-gray-200 relative overflow-hidden"
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

            {/* Dégradé + titre */}
            <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex items-end px-3 pb-3 z-10 pointer-events-none">
              <h3 className="text-white text-xs md:text-sm lg:text-base font-medium line-clamp-2 drop-shadow-sm">
                {title}
              </h3>
            </div>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}
