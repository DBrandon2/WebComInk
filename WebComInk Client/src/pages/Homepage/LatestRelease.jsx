import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import ButtonAnimated from "../../components/ButtonAnimated";
import { IoIosArrowDown } from "react-icons/io";
import { NavLink } from "react-router-dom";
import { getMangas } from "../../services/mangaService";

const BATCH_SIZE = 20;
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

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

    return {
      id: manga.id,
      title,
      coverUrl,
    };
  });
}

export default function LatestRelease() {
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [autoLoadFinished, setAutoLoadFinished] = useState(false);
  const offsetRef = useRef(0);

  const loadLatestManga = useCallback(async () => {
    if (loading || autoLoadFinished) return;
    setLoading(true);

    try {
      const params = {
        limit: BATCH_SIZE,
        lang: "fr",
        offset: offsetRef.current,
        includes: ["cover_art"],
        sort: { updatedAt: "desc" },
      };

      const data = await getMangas(params);
      const mangasWithDetails = enrichMangas(data.data);

      if (mangasWithDetails.length === 0) {
        setAutoLoadFinished(true);
        return;
      }

      setMangas((prevMangas) => [...prevMangas, ...mangasWithDetails]);
      offsetRef.current += BATCH_SIZE;
    } catch (error) {
      console.error(error);
      setError("Erreur lors du chargement des mangas");
    } finally {
      setLoading(false);
    }
  }, [loading, autoLoadFinished]);

  useEffect(() => {
    loadLatestManga();
  }, []); // Load initial batch on mount

  const [visibleCount, setVisibleCount] = useState(10);

  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 20);
    loadLatestManga(); // Load more mangas when button is clicked
  };

  const getTitleFontSize = (title) => {
    if (title.length > 30) {
      return "text-sm";
    }
    return "text-base";
  };

  const carouselRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (carouselRef.current) {
        setContainerWidth(carouselRef.current.offsetWidth);
      }
    };

    window.addEventListener("resize", updateWidth);
    updateWidth();

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const itemWidth = 240;
  const itemSpacing = 16;
  const totalWidth = mangas.length * (itemWidth + itemSpacing) - itemSpacing;

  return (
    <div className="flex flex-col items-center justify-center gap-8 mx-3 lg:my-8 lg:gap-y-12">
      <div className="flex w-full h-full">
        <div className="flex w-full justify-center lg:justify-between items-center lg:px-7">
          <div className="flex flex-col">
            <h1 className="text-3xl text-accent font-medium tracking-wider lg:text-4xl">
              Les dernières sorties
            </h1>
            <h2 className="text-center lg:text-start font-light">
              Découvre les sorties des derniers chapitres
            </h2>
          </div>
          <NavLink to="/comics" className="hidden lg:flex">
            <ButtonAnimated text="Voir les comics" />
          </NavLink>
        </div>
      </div>

      <div className="lg:hidden grid grid-cols-2 md:grid-cols-4 gap-x-2 gap-y-4">
        {mangas.slice(0, visibleCount).map((manga, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <div className="w-[160px] h-[240px] bg-gray-200 flex items-center justify-center">
              <img
                className="w-full h-full object-cover"
                src={manga.coverUrl}
                alt="Manga Cover"
              />
            </div>
            <div className="flex flex-col justify-center items-center w-[180px]">
              <h3
                className={`font-medium text-accent text-center line-clamp-2 ${getTitleFontSize(
                  manga.title
                )}`}
              >
                {manga.title}
              </h3>
              <p className="font-light">Chapitre : {manga.chapter}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop */}
      <div className="hidden lg:block relative w-full overflow-hidden px-6 my-2">
        <div className="absolute top-0 left-0 h-full w-24 z-10 pointer-events-none bg-gradient-to-r from-dark-bg via-dark-bg/70 to-transparent" />

        <div className="absolute top-0 right-0 h-full w-24 z-10 pointer-events-none bg-gradient-to-l from-dark-bg via-dark-bg/70 to-transparent" />

        <motion.div
          ref={carouselRef}
          className="flex space-x-4"
          drag="x"
          dragConstraints={{
            right: 0,
            left: Math.min(0, -(totalWidth - containerWidth + 48 * 2)),
          }}
          whileTap={{ cursor: "grabbing" }}
        >
          {mangas.map((manga, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center gap-2"
              style={{ minWidth: `${itemWidth}px` }}
            >
              <div className="w-[240px] h-[360px] bg-gray-200 flex items-center justify-center">
                <img
                  className="w-full h-full object-cover cursor-pointer "
                  src={manga.coverUrl}
                  alt="Manga Cover"
                  draggable={false}
                />
              </div>
              <div className="flex flex-col justify-center items-center w-[240px]">
                <h3 className="font-medium text-accent text-center line-clamp-2 text-lg tracking-wide">
                  {manga.title}
                </h3>
                <p className="">Chapitre : {manga.chapter}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Show More Button */}
      <div className="lg:hidden">
        {visibleCount < mangas.length && (
          <ButtonAnimated
            text={[
              <span key="text">Afficher plus</span>,
              <IoIosArrowDown key="icon" />,
            ]}
            justify="justify-center"
            onClick={handleShowMore}
          />
        )}
      </div>

      {/* Loading and Error Messages */}
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  );
}
