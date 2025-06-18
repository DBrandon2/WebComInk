import React, { useEffect, useState, useCallback, useRef } from "react";
import ButtonAnimated from "../../components/ButtonAnimated";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { getMangas } from "../../services/mangaService";

const BATCH_SIZE = 18;
const LIMIT_STEP = 300;
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const containerVariants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function enrichMangas(mangas) {
  return mangas.map((manga) => {
    const title =
      manga.attributes.title?.fr ||
      manga.attributes.title?.en ||
      manga.attributes.title?.ja ||
      manga.attributes.title?.["ja-ro"] ||
      Object.values(manga.attributes.title || {})[0] ||
      "Titre non disponible";

    const relationships = manga.relationships || [];

    const coverRel = relationships.find((rel) => rel.type === "cover_art");
    const coverFileName = coverRel?.attributes?.fileName;

    const coverUrl = coverFileName
      ? `${API_BASE_URL}/covers/${manga.id}/${coverFileName}.256.jpg`
      : "/default-cover.png";

    const authors = relationships
      .filter((rel) => rel.type === "author")
      .map((rel) => rel.attributes?.name)
      .filter(Boolean);

    const artists = relationships
      .filter((rel) => rel.type === "artist")
      .map((rel) => rel.attributes?.name)
      .filter(Boolean);

    return {
      id: manga.id,
      title,
      coverUrl,
      authorName:
        authors.length > 0 ? [...new Set(authors)].join(", ") : "Inconnu",
      artistName:
        artists.length > 0 ? [...new Set(artists)].join(", ") : "Inconnu",
    };
  });
}

export default function MangaList({ sort, filter }) {
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [autoLoadFinished, setAutoLoadFinished] = useState(false);

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
      params.sort = sort;
      console.log("Trié par :", { sort });
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
        case "Chapitres récents":
          params.order = { updatedAt: "desc" };
          break;
        default:
          break;
      }

      const data = await getMangas(params);
      const mangasWithDetails = enrichMangas(data.data);

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
  }, [loading, autoLoadFinished, sort, filter]);

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
  }, [sort, filter]);

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
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-4 gap-y-6 w-full"
      >
        {mangas.map((manga) => (
          <motion.div key={manga.id} variants={itemVariants}>
            <div className="flex flex-col items-center gap-2">
              <div className="w-[160px] h-[240px] lg:w-[240px] lg:h-[360px] bg-gray-200 relative overflow-hidden">
                <img
                  src={manga.coverUrl || "/default-cover.png"}
                  alt={`${manga.title} cover`}
                  className="w-full h-full object-cover transition-opacity duration-500 opacity-0"
                  loading="lazy"
                  onLoad={(e) => e.target.classList.remove("opacity-0")}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-cover.png";
                  }}
                />
              </div>
              <div className="flex flex-col justify-center items-center text-center w-full">
                <h3 className="font-medium text-accent line-clamp-2 text-sm md:text-base lg:text-lg">
                  {manga.title}
                </h3>
                <span className="text-xs text-gray-400 md:text-sm line-clamp-2">
                  Auteur : {manga.authorName}
                </span>
                {manga.artistName !== manga.authorName && (
                  <span className="text-xs text-gray-400 md:text-sm line-clamp-2">
                    Artiste : {manga.artistName}
                  </span>
                )}
              </div>
            </div>
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
