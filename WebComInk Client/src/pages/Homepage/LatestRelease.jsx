import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import ButtonAnimated from "../../components/ButtonAnimated";
import { IoIosArrowDown } from "react-icons/io";
import { NavLink, useNavigate } from "react-router-dom";
import { getMangas } from "../../services/mangaService";
import {
  enrichMangas,
  enrichMangasWithChapterNumbers,
  slugify,
} from "../../utils/mangaUtils";

const BATCH_SIZE = 20;

export default function LatestRelease() {
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [autoLoadFinished, setAutoLoadFinished] = useState(false);
  const offsetRef = useRef(0);
  const navigate = useNavigate();

  const loadLatestManga = useCallback(async () => {
    if (loading || autoLoadFinished) return;
    setLoading(true);

    try {
      const params = {
        limit: BATCH_SIZE,
        lang: "fr",
        offset: offsetRef.current,
        includes: ["cover_art"],
        sort: "Chapitres récents",
      };

      const data = await getMangas(params);
      const mangasWithDetails = enrichMangas(data.data);
      const mangasWithChapterNumbers = await enrichMangasWithChapterNumbers(
        mangasWithDetails
      );

      if (mangasWithChapterNumbers.length === 0) {
        setAutoLoadFinished(true);
        return;
      }

      setMangas((prevMangas) => {
        const prevIds = new Set(prevMangas.map((m) => m.id));
        const filteredNew = mangasWithChapterNumbers.filter(
          (m) => !prevIds.has(m.id)
        );
        return [...prevMangas, ...filteredNew];
      });

      offsetRef.current += BATCH_SIZE;
    } catch (error) {
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
    setVisibleCount((prevCount) => prevCount + 10);
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

  const dragRefs = useRef({});
  const isDragging = useRef(false);

  return (
    <section
      aria-labelledby="latest-release-heading"
      className="flex flex-col items-center justify-center gap-8 mx-3 lg:my-8 lg:gap-y-12"
    >
      <header className="flex w-full h-full">
        <div className="flex w-full justify-center lg:justify-between items-center lg:px-7">
          <div className="flex flex-col">
            <h2
              id="latest-release-heading"
              className="text-3xl text-accent font-medium tracking-wider lg:text-4xl"
            >
              Les dernières sorties
            </h2>
            <p className="text-center lg:text-start font-light">
              Découvre les sorties des derniers chapitres
            </p>
          </div>
          <NavLink
            to="/comics"
            state={{ sort: "Chapitres récents" }}
            className="hidden lg:flex"
            aria-label="Voir tous les comics triés par chapitres récents"
          >
            <ButtonAnimated text="Voir les comics" />
          </NavLink>
        </div>
      </header>

      {/* Liste mobile/tablette */}
      <ul
        role="list"
        className="lg:hidden grid grid-cols-2 md:grid-cols-4 gap-x-2 gap-y-4"
      >
        {mangas.slice(0, visibleCount).map((manga, index) => (
          <li key={index} className="flex justify-center">
            <NavLink to={`/Comics/${manga.id}/${slugify(manga.title)}`}>
              <article className="flex flex-col items-center gap-2">
                <motion.div
                  className="w-[160px] h-[240px] bg-gray-200 flex items-center justify-center"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <img
                    className="w-full h-full object-cover"
                    src={manga.coverUrl}
                    alt={`Couverture du manga ${manga.title}`}
                    loading="lazy"
                    decoding="async"
                    sizes="(min-width:1024px) 240px, 160px"
                    width={160}
                    height={240}
                  />
                </motion.div>
                <div className="flex flex-col justify-center items-center w-[180px]">
                  <h3
                    className={`font-medium text-accent text-center line-clamp-2 ${getTitleFontSize(
                      manga.title
                    )}`}
                  >
                    {manga.title}
                  </h3>
                  <p>Chapitre n°{manga.chapterNumber}</p>
                </div>
              </article>
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Desktop */}
      <div className="hidden lg:block relative w-full overflow-hidden px-6 my-2">
        <div className="absolute top-0 left-0 h-full w-24 z-10 pointer-events-none bg-gradient-to-r from-dark-bg via-dark-bg/70 to-transparent" />
        <div className="absolute top-0 right-0 h-full w-24 z-10 pointer-events-none bg-gradient-to-l from-dark-bg via-dark-bg/70 to-transparent" />
        <motion.div
          ref={carouselRef}
          className="flex"
          drag="x"
          dragConstraints={{
            right: 0,
            left: Math.min(0, -(totalWidth - containerWidth + 48 * 2)),
          }}
          whileTap={{ cursor: "grabbing" }}
          onDragStart={() => {
            isDragging.current = true;
          }}
          onDragEnd={() => {
            isDragging.current = false;
          }}
          aria-label="Carrousel des dernières sorties"
          role="region"
        >
          <ul className="flex space-x-4" role="list">
            {mangas.map((manga, index) => {
              if (!dragRefs.current[index]) {
                dragRefs.current[index] = {
                  dragStartX: null,
                  dragMoved: false,
                };
              }
              return (
                <li
                  key={index}
                  style={{ minWidth: `${itemWidth}px` }}
                  className="flex flex-col items-center gap-2"
                >
                  <article>
                    <motion.div
                      className="w-[240px] h-[360px] bg-gray-200 flex items-center justify-center cursor-pointer"
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      onClick={() => {
                        if (!isDragging.current) {
                          navigate(
                            `/Comics/${manga.id}/${slugify(manga.title)}`
                          );
                        }
                      }}
                      tabIndex={0}
                      aria-label={`Voir la fiche de ${manga.title}`}
                    >
                      <img
                        className="w-full h-full object-cover"
                        src={manga.coverUrl}
                        alt={`Couverture du manga ${manga.title}`}
                        draggable={false}
                        loading="lazy"
                        decoding="async"
                        sizes="240px"
                        width={240}
                        height={360}
                      />
                    </motion.div>
                    <div className="flex flex-col justify-center items-center w-[240px]">
                      <h3 className="font-medium text-accent text-center line-clamp-2 text-lg tracking-wide">
                        {manga.title}
                      </h3>
                      <p>Chapitre n°{manga.chapterNumber}</p>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
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
      {loading && <p aria-live="polite">Loading...</p>}
      {error && <p role="alert">{error}</p>}
    </section>
  );
}
