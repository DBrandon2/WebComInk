import React, { useEffect, useState, useCallback, useRef } from "react";
import ButtonAnimated from "../../components/ButtonAnimated";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { getMangas } from "../../services/mangaService";
import {
  enrichMangas,
  enrichMangasWithChapterNumbers,
  slugify,
} from "../../utils/mangaUtils";
import { NavLink } from "react-router-dom";

const BATCH_SIZE = 18;
const LIMIT_STEP = 300;

const containerVariants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function MangaList({
  sort,
  filter,
  includedTags = [],
  excludedTags = [],
}) {
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [autoLoadFinished, setAutoLoadFinished] = useState(false);
  const [lastLoadedIndex, setLastLoadedIndex] = useState(-1);

  const statusMap = {
    tous: null,
    enCours: "ongoing",
    termine: "completed",
  };

  const offsetRef = useRef(0);

  const { ref: loadMoreRef, inView } = useInView({
    rootMargin: "300px",
    triggerOnce: false,
  });

  // Fonction de chargement avec gestion du tri
  const loadMangas = useCallback(async () => {
    if (loading || autoLoadFinished) return;
    setLoading(true);

    try {
      const params = {
        limit: BATCH_SIZE,
        lang: "fr",
        offset: offsetRef.current,
        includes: ["author", "artist", "cover_art"],
      };
      const status = statusMap[filter];
      if (status) {
        params.status = status;
      }

      // Ajouter les tags inclus
      if (includedTags && includedTags.length > 0) {
        params.includedTags = includedTags;
      }

      // Ajouter les tags exclus
      if (excludedTags && excludedTags.length > 0) {
        params.excludedTags = excludedTags;
      }

      params.sort = sort;
      // Tri par date de parution si demandé dans le filtre
      if (sort === "Chapitres récents") {
        params.order = { updatedAt: "desc" };
      } else {
        switch (sort) {
          case "Popularité":
            params.order = { followedCount: "desc" };
            break;
          case "Nouveaux mangas":
            params.order = { createdAt: "desc" };
            break;
          case "A à Z":
            params.order = { title: "asc" };
            break;
          case "Z à A":
            params.order = { title: "desc" };
            break;
          default:
            break;
        }
      }

      const data = await getMangas(params);
      let mangasWithDetails = enrichMangas(data.data);

      // Si le tri est "Chapitres récents", enrichir avec les numéros de chapitres
      if (sort === "Chapitres récents") {
        mangasWithDetails = await enrichMangasWithChapterNumbers(
          mangasWithDetails
        );
      }

      if (mangasWithDetails.length === 0) {
        setAutoLoadFinished(true);
        return;
      }

      setMangas((prevMangas) => {
        const prevIds = new Set(prevMangas.map((m) => m.id));
        const filteredNew = mangasWithDetails.filter((m) => !prevIds.has(m.id));
        return [...prevMangas, ...filteredNew];
      });

      offsetRef.current += mangasWithDetails.length;

      if (
        offsetRef.current >= LIMIT_STEP ||
        mangasWithDetails.length < BATCH_SIZE
      ) {
        setAutoLoadFinished(true);
      }
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des mangas");
    } finally {
      setLoading(false);
    }
  }, [loading, autoLoadFinished, sort, filter, includedTags, excludedTags]);

  // Chargement automatique quand la fin est visible
  useEffect(() => {
    if (inView && !loading && !autoLoadFinished) {
      loadMangas();
    }
  }, [inView, loading, autoLoadFinished, loadMangas]);

  // Réinitialisation à chaque changement de tri
  useEffect(() => {
    offsetRef.current = 0;
    setMangas([]);
    setAutoLoadFinished(false);
    setError(null);
    setLastLoadedIndex(-1);
  }, [sort, filter, includedTags, excludedTags]);

  if (error) return <p className="text-red-500">{error}</p>;

  const renderSkeletons = (count = 6) =>
    Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex flex-col items-center gap-2 animate-pulse">
        <div className="w-[120px] h-[180px] md:w-[180px] md:h-[270px] bg-gray-300 rounded" />
        <div className="h-4 w-24 bg-gray-300 rounded mt-2" />
        <div className="h-3 w-16 bg-gray-200 rounded" />
      </div>
    ));

  return (
    <div className="min-h-screen w-full flex flex-col items-center px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-[auto-fit,minmax(180px,1fr)] gap-x-6 gap-y-10 w-full"
      >
        {mangas.map((manga, idx) => (
          <motion.div key={manga.id} variants={itemVariants}>
            <NavLink to={`/Comics/${manga.id}/${slugify(manga.title)}`}>
              <div className="flex flex-col items-center gap-2">
                <motion.div
                  className="w-[140px] h-[210px] md:w-[180px] md:h-[270px] lg:w-[180px] lg:h-[270px] bg-gray-200 relative overflow-hidden"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  {idx <= lastLoadedIndex + 1 ? (
                    <img
                      src={manga.coverUrl || "/default-cover.png"}
                      alt={`${manga.title} cover`}
                      className="w-full h-full object-cover transition-opacity duration-500 opacity-0"
                      loading="lazy"
                      onLoad={(e) => {
                        e.target.classList.remove("opacity-0");
                        if (idx === lastLoadedIndex + 1)
                          setLastLoadedIndex(idx);
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/default-cover.png";
                        if (idx === lastLoadedIndex + 1)
                          setLastLoadedIndex(idx);
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 animate-pulse" />
                  )}
                </motion.div>
                <div className="flex flex-col justify-center items-center text-center w-full">
                  <h3 className="font-medium text-accent line-clamp-2 text-sm md:text-base lg:text-lg cursor-pointer">
                    {manga.title}
                  </h3>

                  <span className="text-xs text-gray-400 md:text-sm line-clamp-1">
                    Auteur : {manga.authorName}
                  </span>
                  {manga.artistName !== manga.authorName && (
                    <span className="text-xs text-gray-400 md:text-sm line-clamp-1">
                      Artiste : {manga.artistName}
                    </span>
                  )}
                  {/* Afficher le dernier chapitre uniquement si le tri est "Chapitres récents" */}
                  {sort === "Chapitres récents" &&
                    manga.latestChapterNumber &&
                    manga.latestChapterNumber !== "N/A" && (
                      <span className="text-xs text-wh font-light underline md:text-sm mb-1 cursor-pointer">
                        Chapitre {manga.latestChapterNumber}
                      </span>
                    )}
                </div>
              </div>
            </NavLink>
          </motion.div>
        ))}

        {loading && renderSkeletons(9)}
      </motion.div>

      <div ref={loadMoreRef} className="h-1 w-full" />

      {autoLoadFinished && (
        <div className="text-center mt-6">
          <ButtonAnimated
            text={"Afficher plus"}
            justify={"justify-center"}
            onClick={() => {
              setAutoLoadFinished(false);
              loadMangas();
            }}
            disabled={loading}
          />
        </div>
      )}
    </div>
  );
}
