import React, { useEffect, useState, useCallback, useRef } from "react";
import { getMangas } from "../../services/mangaService";
import ButtonAnimated from "../../components/ButtonAnimated";
import { motion } from "framer-motion";

const BATCH_SIZE = 18;
const LIMIT_STEP = 300;

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export function enrichMangas(mangas) {
  return mangas.map((manga) => {
    const title =
      manga.attributes.title?.fr ||
      manga.attributes.title?.en ||
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

export default function MangaList() {
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [autoLoadFinished, setAutoLoadFinished] = useState(false);

  const offsetRef = useRef(0);
  const observerRef = useRef();

  const loadMangas = useCallback(async () => {
    if (loading || autoLoadFinished) return;
    setLoading(true);

    try {
      const data = await getMangas({
        limit: BATCH_SIZE,
        lang: "fr",
        offset: offsetRef.current,
        includes: ["author", "artist", "cover_art"],
      });

      const mangasWithDetails = enrichMangas(data.data);

      if (mangasWithDetails.length === 0) {
        setAutoLoadFinished(true);
        setLoading(false);
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
  }, [loading, autoLoadFinished]);

  useEffect(() => {
    if (autoLoadFinished) return;

    let throttleTimeout = null;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && !throttleTimeout) {
          loadMangas();
          throttleTimeout = setTimeout(() => {
            throttleTimeout = null;
          }, 500);
        }
      },
      { rootMargin: "300px" }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
      if (throttleTimeout) clearTimeout(throttleTimeout);
    };
  }, [loadMangas, loading, autoLoadFinished]);

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
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-2 gap-y-6 w-full max-w-7xl"
      >
        {mangas.map((manga) => (
          <motion.div key={manga.id} variants={itemVariants}>
            <div className="flex flex-col items-center gap-2">
              <div className="w-[120px] h-[180px] md:w-[180px] md:h-[270px] bg-gray-200 relative overflow-hidden">
                <img
                  src={manga.coverUrl || "/default-cover.png"}
                  alt={`${manga.title} cover`}
                  className="w-full h-full object-cover transition-opacity duration-500 opacity-0"
                  loading="lazy"
                  onLoad={(e) => {
                    e.target.classList.remove("opacity-0");
                  }}
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

      <div ref={observerRef} className="h-1 w-full" />

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
