import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import frFlag from "../../assets/flags/fr.svg";
import enFlag from "../../assets/flags/en.svg";
import { FaArrowDown91 } from "react-icons/fa6";
import { FaArrowDown19 } from "react-icons/fa6";
import { motion } from "framer-motion";
import { useReadingHistory } from "./ChapterReader/hooks/useReadingHistory";

export default function ChaptersList({ mangaId }) {
  const { slug } = useParams();
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reverse, setReverse] = useState(false);
  const [chapterImages, setChapterImages] = useState({}); // { chapterId: imageUrl }
  const [page, setPage] = useState(1); // Page courante
  const pageSize = 5; // Nombre de chapitres par page
  const [cooldown, setCooldown] = useState(false); // Cooldown pagination
  const [selectedLang, setSelectedLang] = useState("fr");
  const [detectedLangs, setDetectedLangs] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // Hook pour l'historique de lecture
  const {
    isChapterRead,
    getChapterProgress,
    lastReadChapter: hookLastReadChapter,
  } = useReadingHistory(mangaId);

  // Détection initiale des langues disponibles (fr/en uniquement)
  useEffect(() => {
    async function detectLangs() {
      let langs = [];
      try {
        // Fetch FR
        const resFr = await fetch(
          `${API_BASE_URL}/proxy/chapter-list?manga=${mangaId}&limit=1&translatedLanguage[]=fr&order[chapter]=asc`
        );
        const dataFr = await resFr.json();
        if ((dataFr.data || []).length > 0) langs.push("fr");
      } catch {}
      try {
        // Fetch EN
        const resEn = await fetch(
          `${API_BASE_URL}/proxy/chapter-list?manga=${mangaId}&limit=1&translatedLanguage[]=en&order[chapter]=asc`
        );
        const dataEn = await resEn.json();
        if ((dataEn.data || []).length > 0) langs.push("en");
      } catch {}
      setDetectedLangs(langs);
    }
    if (mangaId) detectLangs();
  }, [mangaId]);

  // Les boutons de langue ne s'affichent que si la langue est détectée
  const availableLangs = detectedLangs;

  // Sélectionne la langue par défaut (fr si dispo, sinon en)
  useEffect(() => {
    if (availableLangs.includes("fr")) setSelectedLang("fr");
    else if (availableLangs.includes("en")) setSelectedLang("en");
  }, [availableLangs.join("")]);

  // Fetch des chapitres selon la langue sélectionnée
  useEffect(() => {
    async function fetchChapters() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${API_BASE_URL}/proxy/chapter-list?manga=${mangaId}&limit=100&translatedLanguage[]=${selectedLang}&order[chapter]=asc&includes[]=scanlation_group`
        );
        const data = await res.json();
        setChapters(data.data || []);
        setPage(1); // Reset pagination à chaque changement de langue
      } catch (e) {
        setError("Erreur lors du chargement des chapitres.");
      } finally {
        setLoading(false);
      }
    }
    if (mangaId && selectedLang) fetchChapters();
  }, [mangaId, selectedLang]);

  // Restaure le cache d'images depuis sessionStorage au montage ou changement de langue
  useEffect(() => {
    const key = `chapterImages_${mangaId}_${selectedLang}`;
    const stored = sessionStorage.getItem(key);
    if (stored) {
      try {
        setChapterImages(JSON.parse(stored));
      } catch (e) {
        // Ignore si corrompu
      }
    } else {
      setChapterImages({}); // Vide le cache si pas de données
    }
  }, [mangaId, selectedLang]);

  // Met à jour le cache sessionStorage à chaque ajout d'image
  useEffect(() => {
    const key = `chapterImages_${mangaId}_${selectedLang}`;
    sessionStorage.setItem(key, JSON.stringify(chapterImages));
  }, [chapterImages, mangaId, selectedLang]);

  // On n'a plus besoin de filtrer les chapitres par langue ici, car l'API ne renvoie que la langue sélectionnée
  const displayedChapters = reverse ? [...chapters].reverse() : chapters;
  const totalPages = Math.ceil(displayedChapters.length / pageSize);
  const startIdx = (page - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const chaptersToShow = displayedChapters.slice(startIdx, endIdx);

  // Fetch uniquement les images de la page courante
  useEffect(() => {
    const displayed = reverse ? [...chapters].reverse() : chapters;
    const startIdx = (page - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    const toFetch = displayed
      .slice(startIdx, endIdx)
      .filter((ch) => !chapterImages[ch.id]);
    if (toFetch.length === 0) return;

    let active = 0;
    let idx = 0;
    const maxSimultaneous = 3;
    let cancelled = false;
    const abortControllers = [];

    function fetchNext() {
      if (cancelled) return;
      if (idx >= toFetch.length) return;
      if (active >= maxSimultaneous) return;
      const ch = toFetch[idx++];
      active++;
      const controller = new AbortController();
      abortControllers.push(controller);
      fetch(`${API_BASE_URL}/proxy/chapter-image/${ch.id}`, {
        signal: controller.signal,
      })
        .then((res) => {
          if (res.status === 429) {
            // Trop de requêtes, on attend 1 seconde et on réessaie
            setTimeout(() => {
              active--;
              idx--; // On remet l'index pour réessayer ce chapitre
              fetchNext();
            }, 1000);
            return Promise.reject("429");
          }
          return res.json();
        })
        .then((data) => {
          if (
            data.chapter &&
            data.chapter.data &&
            data.chapter.data.length > 0 &&
            data.chapter.hash &&
            data.baseUrl
          ) {
            const files = data.chapter.data;
            const file = files[4] || files[files.length - 1];
            const url = `${data.baseUrl}/data/${data.chapter.hash}/${file}`;
            setChapterImages((prev) => {
              const updated = { ...prev, [ch.id]: url };
              return updated;
            });
          }
        })
        .catch((e) => {
          // Si c'est une annulation, on ne fait rien
        })
        .finally(() => {
          active--;
          setTimeout(fetchNext, 200); // Ajoute un délai de 200ms entre chaque fetch
        });
      if (active < maxSimultaneous) fetchNext();
    }
    for (let i = 0; i < maxSimultaneous; i++) fetchNext();

    // Annule les requêtes en cours si on démonte ou change de page/langue
    return () => {
      cancelled = true;
      abortControllers.forEach((ctrl) => ctrl.abort());
    };
    // eslint-disable-next-line
  }, [chapters, reverse, page]);

  // Composant placeholder pour le squelette de chapitre
  function ChapterPlaceholder() {
    return (
      <div className="flex items-center gap-3 p-2 rounded bg-dark-bg/70 border border-accent/30 animate-pulse">
        <div className="w-12 h-16 bg-gray-700 rounded flex-shrink-0" />
        <div className="flex flex-col flex-1 min-w-0 gap-2">
          <div className="h-4 bg-gray-600 rounded w-1/3" />
          <div className="h-4 bg-gray-600 rounded w-2/3" />
          <div className="h-3 bg-gray-700 rounded w-1/4" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-2 mt-4 mb-24 md:items-center">
      <div className="flex items-center justify-between mb-2 md:mb-6 w-full md:max-w-3xl">
        <h3 className="text-md font-medium text-accent md:text-2xl md:font-bold">
          Chapitres disponibles
        </h3>
        <div className="flex items-center gap-2 md:gap-4">
          {availableLangs.length > 1 && (
            <div className="flex gap-1">
              {availableLangs.includes("fr") && (
                <button
                  className={`rounded text-xs font-semibold border transition-all duration-150 cursor-pointer ${
                    selectedLang === "fr"
                      ? "bg-accent text-dark-bg border-accent px-1.5 "
                      : "bg-dark-bg text-accent border-transparent px-2 "
                  }`}
                  onClick={() => setSelectedLang("fr")}
                  disabled={selectedLang === "fr"}
                >
                  <img
                    src={frFlag}
                    alt="FR"
                    className="w-7 h-6 inline-block align-middle rounded-sm cursor-pointer"
                  />
                </button>
              )}
              {availableLangs.includes("en") && (
                <button
                  className={`rounded text-xs font-semibold border transition-all duration-150 cursor-pointer ${
                    selectedLang === "en"
                      ? "bg-accent text-dark-bg border-accent px-1.5 py-0.5"
                      : "bg-dark-bg text-accent border-transparent px-2 py-1"
                  }`}
                  onClick={() => setSelectedLang("en")}
                  disabled={selectedLang === "en"}
                >
                  <img
                    src={enFlag}
                    alt="EN"
                    className="w-7 h-6 inline-block align-middle rounded-sm cursor-pointer"
                  />
                </button>
              )}
            </div>
          )}
          <motion.button
            className="px-3 py-1 rounded bg-accent text-dark-bg text-xs font-semibold hover:bg-accent/80 transition flex items-center justify-center cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setReverse((v) => !v)}
            aria-label={reverse ? "Ordre : plus récent" : "Ordre : plus ancien"}
          >
            <span
              className={`inline-block transition-transform duration-200 ${
                reverse ? "scale-110" : "scale-100"
              }`}
            >
              {reverse ? (
                <FaArrowDown19 size={18} />
              ) : (
                <FaArrowDown91 size={18} />
              )}
            </span>
          </motion.button>
        </div>
      </div>
      {/* Bouton Continuer la lecture sous le titre */}
      {hookLastReadChapter && (
        <div className="flex justify-start mb-4 w-full md:max-w-3xl">
          <motion.button
            className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-sm cursor-pointer border border-accent hover:bg-accent-hover transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.93 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            onClick={() => {
              if (hookLastReadChapter) {
                window.location.href = `/Comics/${mangaId}/${slug}/chapter/${hookLastReadChapter.chapterId}`;
              }
            }}
          >
            <span>▶</span>
            <span>Continuer la lecture</span>
            {hookLastReadChapter.progress < 100 && (
              <span className="text-accent/80 text-xs">
                ({hookLastReadChapter.progress}%)
              </span>
            )}
          </motion.button>
        </div>
      )}
      {/* Liste des chapitres */}
      {loading && (
        <div className="flex flex-col gap-2 md:gap-4 w-full md:max-w-3xl">
          {Array.from({ length: chaptersToShow.length || pageSize }).map(
            (_, i) => (
              <ChapterPlaceholder key={i} />
            )
          )}
        </div>
      )}
      {!loading && error && <div className="text-red-500">{error}</div>}
      {!loading && !error && displayedChapters.length === 0 && (
        <div className="text-gray-400">Aucun chapitre disponible.</div>
      )}
      {!loading && !error && chaptersToShow.length > 0 && (
        <div className="flex flex-col gap-2 md:gap-4 w-full md:max-w-3xl">
          {chaptersToShow.map((ch, idx) => {
            const isRead = isChapterRead(ch.id);
            const progress = getChapterProgress(ch.id);
            const isLastRead =
              hookLastReadChapter && hookLastReadChapter.chapterId === ch.id;

            return (
              <Link
                key={ch.id}
                to={`/Comics/${mangaId}/${slug}/chapter/${ch.id}`}
                className={`flex items-center gap-3 p-2 md:p-4 rounded transition-all duration-200 cursor-pointer ${
                  isRead
                    ? "bg-dark-bg/50 hover:bg-dark-bg/70 hover:scale-[1.02]"
                    : isLastRead
                    ? "bg-blue-900/30 hover:bg-blue-900/50 hover:scale-[1.02]"
                    : "bg-dark-bg/70 hover:bg-dark-bg/90 hover:scale-[1.02]"
                }`}
              >
                <div className="w-12 h-16 bg-gray-700 rounded flex-shrink-0 flex items-center justify-center overflow-hidden md:w-16 md:h-24 relative">
                  {chapterImages[ch.id] ? (
                    <img
                      src={chapterImages[ch.id]}
                      alt="Page du chapitre"
                      className={`object-cover w-full h-full ${
                        isRead ? "grayscale opacity-60" : ""
                      }`}
                    />
                  ) : (
                    <span className="text-xs text-gray-400">Image</span>
                  )}
                  {/* Indicateur de lecture */}
                  {isLastRead && !isRead && (
                    <div className="absolute top-1 right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">▶</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex flex-row items-center gap-3 flex-wrap w-full min-w-0">
                    <span className="text-xs text-gray-400 whitespace-nowrap flex-1">
                      N° : {ch.attributes.chapter || "?"}
                    </span>
                    <span
                      className={`text-xs sm:text-sm md:text-base flex items-center gap-2 flex-[3_1_0%] text-center break-words ${
                        isRead
                          ? "text-gray-500"
                          : isLastRead
                          ? "text-blue-400"
                          : "text-accent"
                      }`}
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxHeight: "3.2em",
                      }}
                    >
                      {ch.attributes.title ||
                        `Chapitre ${ch.attributes.chapter || "?"}`}
                      {isRead && progress < 100 && (
                        <span className="text-xs text-gray-400 ml-2">
                          ({progress}%)
                        </span>
                      )}
                    </span>
                    <span
                      className={`text-xs whitespace-nowrap flex-1 ${
                        isRead ? "text-gray-400" : "text-white"
                      }`}
                    >
                      {/* Date courte en mobile, longue en desktop */}
                      <span className="inline sm:hidden">
                        {ch.attributes.publishAt
                          ? (() => {
                              const d = new Date(ch.attributes.publishAt);
                              const day = d
                                .getDate()
                                .toString()
                                .padStart(2, "0");
                              const month = (d.getMonth() + 1)
                                .toString()
                                .padStart(2, "0");
                              const year = d.getFullYear().toString().slice(-2);
                              return `${day}/${month}/${year}`;
                            })()
                          : "Date inconnue"}
                      </span>
                      <span className="hidden sm:inline md:text-base">
                        {ch.attributes.publishAt
                          ? new Date(
                              ch.attributes.publishAt
                            ).toLocaleDateString()
                          : "Date inconnue"}
                      </span>
                      {/* Groupe de traduction (team) */}
                      {ch.relationships &&
                        ch.relationships.find(
                          (rel) =>
                            rel.type === "scanlation_group" &&
                            rel.attributes?.name
                        ) && (
                          <span
                            className={`block text-[0.72rem] mt-0.5 font-semibold truncate max-w-[120px] ${
                              isRead ? "text-gray-500" : "text-accent/80"
                            }`}
                          >
                            {
                              ch.relationships.find(
                                (rel) =>
                                  rel.type === "scanlation_group" &&
                                  rel.attributes?.name
                              ).attributes.name
                            }
                          </span>
                        )}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
      {!loading && !error && chaptersToShow.length > 0 && (
        <div className="flex justify-center items-center gap-2 mt-2 md:mt-6 md:gap-4">
          {/* Flèche gauche */}
          <button
            className="px-3 py-2 flex items-center justify-center rounded-md bg-accent text-dark-bg shadow-md transition hover:bg-accent/80 focus:outline-none focus:ring-2 focus:ring-accent/70 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            onClick={() => {
              if (!cooldown && page > 1) {
                setPage((p) => Math.max(1, p - 1));
                setCooldown(true);
                setTimeout(() => setCooldown(false), 500);
              }
            }}
            disabled={page === 1 || cooldown}
            aria-label="Page précédente"
            type="button"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 15L6 9L12 3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {/* Pages numérotées */}
          <div
            className="flex overflow-x-auto flex-nowrap gap-1 md:gap-2 max-w-full scrollbar-thin scrollbar-thumb-accent/60 scrollbar-track-transparent"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {(() => {
              const items = [];
              if (totalPages > 0) {
                items.push(
                  <button
                    key={1}
                    className={`px-3 py-2 rounded-md border-2 font-semibold text-sm mx-0.5 transition focus:outline-none focus:ring-2 focus:ring-accent/70 cursor-pointer
                      ${
                        page === 1
                          ? "bg-accent text-dark-bg border-accent shadow"
                          : "bg-transparent text-accent border-accent hover:bg-accent/10"
                      }
                    `}
                    onClick={() => {
                      if (!cooldown) {
                        setPage(1);
                        setCooldown(true);
                        setTimeout(() => setCooldown(false), 500);
                      }
                    }}
                    disabled={cooldown}
                    aria-label={`Page 1`}
                    type="button"
                  >
                    1
                  </button>
                );
              }
              if (page > 3) {
                items.push(
                  <span
                    key="start-ellipsis"
                    className="px-1 text-accent select-none"
                  >
                    …
                  </span>
                );
              }
              for (
                let i = Math.max(2, page - 1);
                i <= Math.min(totalPages - 1, page + 1);
                i++
              ) {
                if (i === 1 || i === totalPages) continue;
                items.push(
                  <button
                    key={i}
                    className={`px-3 py-2 rounded-md border-2 font-semibold text-sm mx-0.5 transition focus:outline-none focus:ring-2 focus:ring-accent/70 cursor-pointer
                      ${
                        page === i
                          ? "bg-accent text-dark-bg border-accent shadow"
                          : "bg-transparent text-accent border-accent hover:bg-accent/10"
                      }
                    `}
                    onClick={() => {
                      if (!cooldown) {
                        setPage(i);
                        setCooldown(true);
                        setTimeout(() => setCooldown(false), 500);
                      }
                    }}
                    disabled={cooldown}
                    aria-label={`Page ${i}`}
                    type="button"
                  >
                    {i}
                  </button>
                );
              }
              if (page < totalPages - 2) {
                items.push(
                  <span
                    key="end-ellipsis"
                    className="px-1 text-accent select-none"
                  >
                    …
                  </span>
                );
              }
              if (totalPages > 1) {
                items.push(
                  <button
                    key={totalPages}
                    className={`px-3 py-2 rounded-md border-2 font-semibold text-sm mx-0.5 transition focus:outline-none focus:ring-2 focus:ring-accent/70 cursor-pointer
                      ${
                        page === totalPages
                          ? "bg-accent text-dark-bg border-accent shadow"
                          : "bg-transparent text-accent border-accent hover:bg-accent/10"
                      }
                    `}
                    onClick={() => {
                      if (!cooldown) {
                        setPage(totalPages);
                        setCooldown(true);
                        setTimeout(() => setCooldown(false), 500);
                      }
                    }}
                    disabled={cooldown}
                    aria-label={`Page ${totalPages}`}
                    type="button"
                  >
                    {totalPages}
                  </button>
                );
              }
              return items;
            })()}
          </div>
          {/* Flèche droite */}
          <button
            className="px-3 py-2 flex items-center justify-center rounded-md bg-accent text-dark-bg shadow-md transition hover:bg-accent/80 focus:outline-none focus:ring-2 focus:ring-accent/70 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            onClick={() => {
              if (!cooldown && page < totalPages) {
                setPage((p) => Math.min(totalPages, p + 1));
                setCooldown(true);
                setTimeout(() => setCooldown(false), 500);
              }
            }}
            disabled={page === totalPages || cooldown}
            aria-label="Page suivante"
            type="button"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 3L12 9L6 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
