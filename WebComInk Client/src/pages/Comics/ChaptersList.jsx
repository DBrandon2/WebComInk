import React, { useEffect, useState } from "react";
import frFlag from "../../assets/flags/fr.svg";
import enFlag from "../../assets/flags/en.svg";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

export default function ChaptersList({ mangaId }) {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reverse, setReverse] = useState(false);
  const [chapterImages, setChapterImages] = useState({}); // { chapterId: imageUrl }
  const [page, setPage] = useState(1); // Page courante
  const pageSize = 5; // Nombre de chapitres par page
  const [cooldown, setCooldown] = useState(false); // Cooldown pagination
  const [selectedLang, setSelectedLang] = useState("fr");

  // Détecte les langues disponibles dans les chapitres
  const availableLangs = React.useMemo(() => {
    const langs = new Set(
      chapters.map((ch) => ch.attributes.translatedLanguage)
    );
    return Array.from(langs);
  }, [chapters]);

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
          `https://api.mangadex.org/chapter?manga=${mangaId}&limit=100&translatedLanguage[]=${selectedLang}&order[chapter]=desc`
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

    function fetchNext() {
      if (idx >= toFetch.length) return;
      if (active >= maxSimultaneous) return;
      const ch = toFetch[idx++];
      active++;
      fetch(`/chapter-image/${ch.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (
            data.chapter &&
            data.chapter.data &&
            data.chapter.data.length > 0 &&
            data.chapter.hash &&
            data.baseUrl
          ) {
            // Prendre la 5ème image ou la dernière si moins de 5
            const files = data.chapter.data;
            const file = files[4] || files[files.length - 1];
            const url = `${data.baseUrl}/data/${data.chapter.hash}/${file}`;
            setChapterImages((prev) => {
              const updated = { ...prev, [ch.id]: url };
              // sessionStorage est mis à jour automatiquement par l'autre useEffect
              return updated;
            });
          }
        })
        .catch(() => {})
        .finally(() => {
          active--;
          fetchNext();
        });
      if (active < maxSimultaneous) fetchNext();
    }
    for (let i = 0; i < maxSimultaneous; i++) fetchNext();
    // eslint-disable-next-line
  }, [chapters, reverse, page]);

  return (
    <div className="w-full flex flex-col gap-2 mt-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-accent">Chapitres disponibles</h3>
        <div className="flex items-center gap-2">
          {availableLangs.length > 1 && (
            <div className="flex gap-1">
              {availableLangs.includes("fr") && (
                <button
                  className={`px-2 py-1 rounded text-xs font-semibold border ${
                    selectedLang === "fr"
                      ? "bg-accent text-dark-bg border-accent"
                      : "bg-dark-bg text-accent border-accent/50"
                  }`}
                  onClick={() => setSelectedLang("fr")}
                  disabled={selectedLang === "fr"}
                >
                  FR
                </button>
              )}
              {availableLangs.includes("en") && (
                <button
                  className={`px-2 py-1 rounded text-xs font-semibold border ${
                    selectedLang === "en"
                      ? "bg-accent text-dark-bg border-accent"
                      : "bg-dark-bg text-accent border-accent/50"
                  }`}
                  onClick={() => setSelectedLang("en")}
                  disabled={selectedLang === "en"}
                >
                  EN
                </button>
              )}
            </div>
          )}
          <button
            className="px-3 py-1 rounded bg-accent text-dark-bg text-xs font-semibold hover:bg-accent/80 transition flex items-center justify-center"
            onClick={() => setReverse((v) => !v)}
            aria-label={reverse ? "Ordre : plus récent" : "Ordre : plus ancien"}
          >
            <span
              className={`inline-block transition-transform duration-200 ${
                reverse ? "scale-110" : "scale-100"
              }`}
            >
              {reverse ? <FaArrowUp size={18} /> : <FaArrowDown size={18} />}
            </span>
          </button>
        </div>
      </div>
      {loading && <div>Chargement des chapitres...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && displayedChapters.length === 0 && (
        <div className="text-gray-400">Aucun chapitre disponible.</div>
      )}
      {!loading && !error && chaptersToShow.length > 0 && (
        <div className="flex flex-col gap-2">
          {chaptersToShow.map((ch, idx) => (
            <div
              key={ch.id}
              className="flex items-center gap-3 p-2 rounded bg-dark-bg/70 border border-accent/30"
            >
              <div className="w-12 h-16 bg-gray-700 rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
                {chapterImages[ch.id] ? (
                  <img
                    src={chapterImages[ch.id]}
                    alt="Page du chapitre"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-xs text-gray-400">Image</span>
                )}
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex flex-row items-center gap-3 flex-wrap w-full min-w-0">
                  <span className="text-xs text-gray-400 whitespace-nowrap flex-1">
                    N° : {ch.attributes.chapter || "?"}
                  </span>
                  <span
                    className="text-accent text-xs sm:text-sm flex items-center gap-2 flex-[3_1_0%] text-center break-words"
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
                  </span>
                  <span className="text-xs text-gray-400 whitespace-nowrap flex-1">
                    {/* Date courte en mobile, longue en desktop */}
                    <span className="inline sm:hidden">
                      {ch.attributes.publishAt
                        ? (() => {
                            const d = new Date(ch.attributes.publishAt);
                            const day = d.getDate().toString().padStart(2, "0");
                            const month = (d.getMonth() + 1)
                              .toString()
                              .padStart(2, "0");
                            const year = d.getFullYear().toString().slice(-2);
                            return `${day}/${month}/${year}`;
                          })()
                        : "Date inconnue"}
                    </span>
                    <span className="hidden sm:inline">
                      {ch.attributes.publishAt
                        ? new Date(ch.attributes.publishAt).toLocaleDateString()
                        : "Date inconnue"}
                    </span>
                  </span>
                  {/* Drapeau langue */}
                  {ch.attributes.translatedLanguage === "fr" ? (
                    <img
                      src={frFlag}
                      alt="FR"
                      className="ml-2 w-5 h-4 inline-block align-middle rounded-sm"
                    />
                  ) : ch.attributes.translatedLanguage === "en" ? (
                    <img
                      src={enFlag}
                      alt="EN"
                      className="ml-2 w-5 h-4 inline-block align-middle rounded-sm"
                    />
                  ) : (
                    <span className="ml-2 px-1 py-0.5 rounded bg-gray-700 text-xs text-white">
                      {ch.attributes.translatedLanguage.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          {/* Pagination intelligente */}
          <div className="flex justify-center items-center gap-2 mt-2">
            <button
              className="px-2 py-1 bg-accent text-dark-bg rounded disabled:opacity-50"
              onClick={() => {
                if (!cooldown && page > 1) {
                  setPage((p) => Math.max(1, p - 1));
                  setCooldown(true);
                  setTimeout(() => setCooldown(false), 500);
                }
              }}
              disabled={page === 1 || cooldown}
            >
              &lt;
            </button>
            <div
              className="flex overflow-x-auto flex-nowrap gap-1 max-w-full scrollbar-thin scrollbar-thumb-accent/60 scrollbar-track-transparent"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {(() => {
                const items = [];
                if (totalPages > 0) {
                  items.push(
                    <button
                      key={1}
                      className={`px-2 py-1 rounded font-semibold text-xs sm:text-sm mx-0.5 min-w-[32px] sm:min-w-[36px] ${
                        page === 1
                          ? "bg-accent text-dark-bg"
                          : "bg-dark-bg text-accent border border-accent/50"
                      }`}
                      onClick={() => {
                        if (!cooldown) {
                          setPage(1);
                          setCooldown(true);
                          setTimeout(() => setCooldown(false), 500);
                        }
                      }}
                      disabled={cooldown}
                    >
                      1
                    </button>
                  );
                }
                if (page > 3) {
                  items.push(
                    <span key="start-ellipsis" className="px-1 text-accent">
                      ...
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
                      className={`px-2 py-1 rounded font-semibold text-xs sm:text-sm mx-0.5 min-w-[32px] sm:min-w-[36px] ${
                        page === i
                          ? "bg-accent text-dark-bg"
                          : "bg-dark-bg text-accent border border-accent/50"
                      }`}
                      onClick={() => {
                        if (!cooldown) {
                          setPage(i);
                          setCooldown(true);
                          setTimeout(() => setCooldown(false), 500);
                        }
                      }}
                      disabled={cooldown}
                    >
                      {i}
                    </button>
                  );
                }
                if (page < totalPages - 2) {
                  items.push(
                    <span key="end-ellipsis" className="px-1 text-accent">
                      ...
                    </span>
                  );
                }
                if (totalPages > 1) {
                  items.push(
                    <button
                      key={totalPages}
                      className={`px-2 py-1 rounded font-semibold text-xs sm:text-sm mx-0.5 min-w-[32px] sm:min-w-[36px] ${
                        page === totalPages
                          ? "bg-accent text-dark-bg"
                          : "bg-dark-bg text-accent border border-accent/50"
                      }`}
                      onClick={() => {
                        if (!cooldown) {
                          setPage(totalPages);
                          setCooldown(true);
                          setTimeout(() => setCooldown(false), 500);
                        }
                      }}
                      disabled={cooldown}
                    >
                      {totalPages}
                    </button>
                  );
                }
                return items;
              })()}
            </div>
            <button
              className="px-2 py-1 bg-accent text-dark-bg rounded disabled:opacity-50"
              onClick={() => {
                if (!cooldown && page < totalPages) {
                  setPage((p) => Math.min(totalPages, p + 1));
                  setCooldown(true);
                  setTimeout(() => setCooldown(false), 500);
                }
              }}
              disabled={page === totalPages || cooldown}
            >
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
