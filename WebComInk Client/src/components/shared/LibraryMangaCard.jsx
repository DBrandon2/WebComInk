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
      className="group relative select-none will-change-transform"
      {...(!isDragging && {
        whileHover: { scale: 1.05 },
      })}
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
        tabIndex={0}
        draggable={false}
        style={isDragging ? { pointerEvents: "none" } : {}}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="relative  rounded bg-gray-200 shadow-sm w-[160px] h-[240px] lg:w-[220px] lg:h-[330px] 2xl:w-[185px] 2xl:h-[277px]">
            {/* Image */}
            <img
              src={coverUrl || "/default-cover.png"}
              alt={`${title} cover`}
              className="w-full h-full object-cover select-none"
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
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
