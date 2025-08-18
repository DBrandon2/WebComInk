import React from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { slugify } from "../../utils/mangaUtils";

export default function MangaCard({
  id,
  title,
  coverUrl,
  latestChapterNumber,
  showLatestChapter = false,
  onRemove,
  removable = false,
  to,
  children,
}) {
  return (
    <motion.div variants={{}}>
      <NavLink to={to || `/Comics/${id}/${slugify(title)}`}>
        <div className="flex flex-col items-center gap-2 ">
          <motion.div
            className="w-[160px] h-[240px] lg:w-[240px] lg:h-[360px] bg-gray-200 relative overflow-hidden"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <img
              src={coverUrl || "/default-cover.png"}
              alt={`${title} cover`}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              sizes="(min-width:1024px) 240px, 160px"
              width={240}
              height={360}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-cover.png";
              }}
            />
            {removable && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRemove && onRemove(id);
                }}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg z-10"
                title="Retirer des favoris"
              >
                {children}
              </button>
            )}
          </motion.div>
          <div className="flex flex-col justify-center items-center text-center w-full ">
            <h3
              className="font-medium text-accent line-clamp-2 text-sm md:text-base lg:text-lg cursor-pointer"
              aria-label={`Voir la fiche de ${title}`}
            >
              {title}
            </h3>
            {showLatestChapter &&
              latestChapterNumber &&
              latestChapterNumber !== "N/A" && (
                <span className="text-xs text-wh font-light underline md:text-sm mb-1 cursor-pointer">
                  Chapitre {latestChapterNumber}
                </span>
              )}
          </div>
        </div>
      </NavLink>
    </motion.div>
  );
}
