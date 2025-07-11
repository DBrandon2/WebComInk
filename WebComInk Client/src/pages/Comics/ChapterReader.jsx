import React, {
  useEffect,
  useState,
  useRef,
  createContext,
  useContext,
} from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import logo from "../../assets/logo/chat-mignon-baillant-somnolent-cartoon-vector-icon-illustration-concept-icone-nature-animale-isole-vecteur-premium-style-dessin-anime-plat.png";
import {
  FaArrowLeft,
  FaArrowRight,
  FaHome,
  FaList,
  FaChevronDown,
  FaTimes,
  FaSearch,
  FaCog,
} from "react-icons/fa";
import { Grip } from "lucide-react";
import CustomChapterSelect from "../../components/shared/CustomChapterSelect";
import { useDrag } from "@use-gesture/react";
import { AnimatePresence, motion } from "framer-motion";

// Créer le contexte
export const ChapterReaderContext = createContext();

export default function ChapterReader() {
  const { mangaId, slug, chapterId } = useParams();
  const navigate = useNavigate();

  const [chapter, setChapter] = useState(null);
  const [chapterImages, setChapterImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoadingStates, setImageLoadingStates] = useState({});
  const [allChapters, setAllChapters] = useState([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(-1);
  const [mangaTitle, setMangaTitle] = useState("");
  const [showHeader, setShowHeader] = useState(true);
  const [loadedPages, setLoadedPages] = useState(new Set());
  const [showChapterSelector, setShowChapterSelector] = useState(false);
  const [chapterSearchTerm, setChapterSearchTerm] = useState("");
  const [readingProgress, setReadingProgress] = useState(0);
  const [chapterProgress, setChapterProgress] = useState(0);
  const [nextChapterData, setNextChapterData] = useState(null);
  const scrollContainerRef = useRef(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [circleProgress, setCircleProgress] = useState(0);
  const progressActive = useRef(false);
  const circleStep = 34; // 3 scrolls pour 100%
  const [pullHeight, setPullHeight] = useState(0);
  const pullHeightRef = useRef(0);
  const [isOverscrolling, setIsOverscrolling] = useState(false);
  const startYRef = useRef(null);
  const overscrollActive = useRef(false);
  const maxPull = 120; // px
  const triggerPull = 100; // px
  const SCROLL_TOLERANCE = 24; // px, plus permissif
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsBtnRef = useRef(null);
  const [modalOrigin, setModalOrigin] = useState({ x: 0, y: 0 });

  // Hook useDrag (mobile only)
  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;
  const bind = useDrag(
    ({ down, movement: [, my], last, event }) => {
      if (!isMobile) return;
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const isNearBottom = docHeight - scrollTop <= SCROLL_TOLERANCE;
      if (!isNearBottom) {
        if (pullHeight !== 0) setPullHeight(0); // reset si on n'est pas en bas
        return;
      }
      if (down && my < 0) {
        // Augmentation de la résistance : division par 2 pour rendre le drag plus difficile
        const resistance = -my / 2;
        setPullHeight(Math.min(maxPull, resistance));
      } else if (last) {
        // Passage au chapitre suivant réactivé
        if (
          pullHeight >= triggerPull &&
          allChapters &&
          currentChapterIndex > 0
        ) {
          const nextChapter = allChapters[currentChapterIndex - 1];
          if (nextChapter) {
            setPullHeight(0);
            navigate(`/Comics/${mangaId}/${slug}/chapter/${nextChapter.id}`);
            return;
          }
        }
        setPullHeight(0);
      }
    },
    { pointer: { touch: true }, enabled: isMobile }
  );

  // Récupération des métadonnées du chapitre
  useEffect(() => {
    async function fetchChapter() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/chapter/${chapterId}`);
        if (!response.ok) {
          throw new Error("Chapitre non trouvé");
        }

        const data = await response.json();
        setChapter(data.data);

        // Récupération des données d'images
        const imageResponse = await fetch(`/chapter-image/${chapterId}`);
        if (!imageResponse.ok) {
          throw new Error("Images du chapitre non trouvées");
        }

        const imageData = await imageResponse.json();
        if (imageData.chapter && imageData.baseUrl) {
          // Récupérer la qualité choisie par l'utilisateur
          let quality = "data";
          if (typeof window !== "undefined") {
            quality = localStorage.getItem("imageQuality") || "data";
          }
          const files =
            quality === "data-saver"
              ? imageData.chapter.dataSaver
              : imageData.chapter.data;
          const qualityPath = quality === "data-saver" ? "data-saver" : "data";
          if (files && Array.isArray(files)) {
            const images = files.map(
              (filename) =>
                `${imageData.baseUrl}/${qualityPath}/${imageData.chapter.hash}/${filename}`
            );
            setChapterImages(images);

            // Initialiser les états de chargement des images
            const initialLoadingStates = {};
            images.forEach((_, index) => {
              initialLoadingStates[index] = true;
            });
            setImageLoadingStates(initialLoadingStates);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (chapterId) {
      fetchChapter();
    }
  }, [chapterId]);

  // Récupération de la liste des chapitres pour la navigation
  useEffect(() => {
    async function fetchAllChapters() {
      try {
        // On récupère la langue du chapitre courant (par défaut fr)
        const lang = chapter?.attributes?.translatedLanguage || "fr";
        const response = await fetch(
          `https://api.mangadex.org/chapter?manga=${mangaId}&limit=100&order[chapter]=desc&includes[]=scanlation_group&translatedLanguage[]=${lang}`
        );
        const data = await response.json();
        const chapters = data.data || [];
        setAllChapters(chapters);

        // Trouver l'index du chapitre actuel
        const currentIndex = chapters.findIndex((ch) => ch.id === chapterId);
        setCurrentChapterIndex(currentIndex);

        // Récupérer le titre du manga
        if (chapters.length > 0) {
          const mangaRelation = chapters[0].relationships?.find(
            (rel) => rel.type === "manga"
          );
          if (mangaRelation) {
            setMangaTitle(
              mangaRelation.attributes?.title?.fr ||
                mangaRelation.attributes?.title?.en ||
                "Manga"
            );
          }
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des chapitres:", err);
      }
    }

    if (mangaId && chapter) {
      fetchAllChapters();
    }
  }, [mangaId, chapterId, chapter]);

  // Chargement séquentiel des pages
  useEffect(() => {
    if (chapterImages.length === 0) return;

    let isMounted = true;
    const loadPagesSequentially = async () => {
      let localSet = new Set();
      for (let i = 0; i < chapterImages.length; i++) {
        if (!isMounted) return;
        if (i > 0) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        localSet.add(i);
        setLoadedPages(new Set(localSet));
      }
    };
    loadPagesSequentially();
    return () => {
      isMounted = false;
    };
  }, [chapterImages]);

  const handleImageLoad = (index) => {
    setImageLoadingStates((prev) => ({
      ...prev,
      [index]: false,
    }));
  };

  const handleImageError = (index) => {
    setImageLoadingStates((prev) => ({
      ...prev,
      [index]: false,
    }));
  };

  // Inversé pour correspondre à la logique utilisateur (← = chapitre précédent, → = chapitre suivant)
  const goToPreviousChapter = () => {
    if (currentChapterIndex < allChapters.length - 1) {
      const prevChapter = allChapters[currentChapterIndex + 1];
      navigate(`/Comics/${mangaId}/${slug}/chapter/${prevChapter.id}`);
    }
  };

  const goToNextChapter = () => {
    if (currentChapterIndex > 0) {
      const nextChapter = allChapters[currentChapterIndex - 1];
      navigate(`/Comics/${mangaId}/${slug}/chapter/${nextChapter.id}`);
    }
  };

  const goToChapter = (chapterId) => {
    navigate(`/Comics/${mangaId}/${slug}/chapter/${chapterId}`);
    setShowChapterSelector(false);
  };

  // Filtrer les chapitres pour la recherche
  const filteredChapters = allChapters.filter((ch) => {
    const chapterNum = ch.attributes.chapter || "";
    const title = ch.attributes.title || "";
    const searchLower = chapterSearchTerm.toLowerCase();
    return (
      chapterNum.includes(searchLower) ||
      title.toLowerCase().includes(searchLower)
    );
  });

  // Menu déroulant large avec titre manga + chapitre
  const ChapterSelectorDropdown = ({ direction = "down" }) => (
    <CustomChapterSelect
      chapters={allChapters}
      currentChapterId={chapterId}
      onSelect={goToChapter}
      direction={direction}
    />
  );

  // Synchronisation de la navbar mobile du site avec l'état showHeader
  useEffect(() => {
    if (!showHeader) {
      document.body.classList.add("immersive-reader-ui");
    } else {
      document.body.classList.remove("immersive-reader-ui");
    }
    // Synchronise la disparition du bouton ScrollToTop
    window.dispatchEvent(
      new CustomEvent("toggle-scrolltotop", { detail: { showHeader } })
    );
    return () => {
      document.body.classList.remove("immersive-reader-ui");
      window.dispatchEvent(
        new CustomEvent("toggle-scrolltotop", { detail: { showHeader: true } })
      );
    };
  }, [showHeader]);

  // Masquer la navbar desktop du site sur toute la page de lecture
  useEffect(() => {
    document.body.classList.add("immersive-reader-desktop");
    // Empêche le scroll horizontal sur mobile
    document.body.style.overflowX = "hidden";
    return () => {
      document.body.classList.remove("immersive-reader-desktop");
      document.body.style.overflowX = "";
    };
  }, []);

  // Préchargement du chapitre suivant
  useEffect(() => {
    if (
      currentChapterIndex >= 0 &&
      currentChapterIndex < allChapters.length - 1
    ) {
      const nextChapter = allChapters[currentChapterIndex + 1];
      if (nextChapter && !nextChapterData) {
        // Précharger les métadonnées du chapitre suivant
        fetch(`/chapter-image/${nextChapter.id}`)
          .then((res) => res.json())
          .then((data) => setNextChapterData(data))
          .catch(() => {}); // Ignore les erreurs de préchargement
      }
    }
  }, [currentChapterIndex, allChapters, nextChapterData]);

  // Suivi de la progression de lecture (sans sauvegarde)
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setReadingProgress(Math.min(100, Math.max(0, scrollPercent)));
      if (allChapters.length > 0 && currentChapterIndex >= 0) {
        const seriesProgress =
          ((allChapters.length - currentChapterIndex - 1) /
            allChapters.length) *
          100;
        setChapterProgress(seriesProgress);
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [allChapters.length, currentChapterIndex, chapterId, mangaId]);

  // Gestion du scroll et navigation clavier
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignorer si on est dans un input
      if (e.target.tagName === "INPUT") return;

      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" });
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        window.scrollBy({ top: -window.innerHeight * 0.8, behavior: "smooth" });
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPreviousChapter();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNextChapter();
      } else if (e.key === "c" || e.key === "C") {
        e.preventDefault();
        setShowChapterSelector(true);
      } else if (e.key === "Escape") {
        setShowChapterSelector(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentChapterIndex, allChapters.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-accent">Chargement du chapitre...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Link
            to={`/Comics/${mangaId}/${slug}`}
            className="bg-accent text-dark-bg px-4 py-2 rounded hover:bg-accent/80 transition"
          >
            Retour au manga
          </Link>
        </div>
      </div>
    );
  }

  // Rendu principal
  return (
    <ChapterReaderContext.Provider
      value={{
        allChapters,
        currentChapterIndex,
        nextChapterData,
        chapterId,
        mangaId,
        slug,
      }}
    >
      <div
        className="min-h-screen bg-dark-bg mt-[-12px] overflow-x-hidden"
        {...bind()}
      >
        {/* Header de navigation, affiché seulement si showHeader */}
        <div
          className={`fixed top-0 left-0 w-full z-50 bg-dark-bg/95 backdrop-blur-sm border-b border-accent/30 transition-opacity duration-300 ${
            showHeader
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="max-w-5xl mx-auto px-4 md:px-6 py-2 md:py-3">
            <div className="flex items-center justify-between w-full gap-x-2 md:gap-x-6">
              {/* Logo à gauche (desktop only) */}
              <div className="hidden md:flex items-center min-w-[60px] mr-2">
                <Link to="/" className="flex items-center" title="Accueil">
                  <img
                    src={logo}
                    alt="Logo"
                    className="w-10 h-10 md:w-14 md:h-14 object-contain transition-transform duration-300 ease-in-out transform hover:scale-120 hover:rotate-[-5deg] z-50"
                  />
                </Link>
              </div>
              {/* Bouton grip toujours visible, à gauche */}
              <div className="flex items-center min-w-[40px]">
                <Link
                  to={`/Comics/${mangaId}/${slug}`}
                  className="flex items-center gap-2 px-3 py-2 rounded text-white hover:bg-accent hover:text-dark-bg transition text-sm font-semibold"
                  title="Retour au manga"
                >
                  <span className="text-[20px] md:text-[28px] flex items-center">
                    <Grip />
                  </span>
                  <span className="hidden sm:inline">Retour au manga</span>
                </Link>
              </div>
              {/* Navigation centrale, prend toute la place restante */}
              <div className="flex flex-wrap items-center justify-center flex-1 gap-1 md:gap-3 min-w-0 overflow-x-auto">
                {/* Bouton précédent : visible seulement sur desktop */}
                <button
                  onClick={goToPreviousChapter}
                  disabled={currentChapterIndex >= allChapters.length - 1}
                  className="hidden sm:flex w-8 h-8 bg-accent text-dark-bg rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/80 transition shadow items-center justify-center cursor-pointer"
                  title="Chapitre précédent (←)"
                >
                  <FaArrowLeft size={18} />
                </button>
                <div className="min-w-0 flex items-center justify-center">
                  <ChapterSelectorDropdown direction="down" />
                </div>
                {/* Bouton suivant : visible seulement sur desktop */}
                <button
                  onClick={goToNextChapter}
                  disabled={currentChapterIndex <= 0}
                  className="hidden sm:flex w-8 h-8 bg-accent text-dark-bg rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/80 transition shadow items-center justify-center cursor-pointer"
                  title="Chapitre suivant (→)"
                >
                  <FaArrowRight size={18} />
                </button>
              </div>
              {/* Settings à droite */}
              <div className="flex items-center min-w-[40px] justify-end">
                <button
                  ref={settingsBtnRef}
                  className="p-2 md:p-3 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition shadow"
                  title="Options / Paramètres"
                  onClick={() => {
                    if (settingsBtnRef.current) {
                      const rect =
                        settingsBtnRef.current.getBoundingClientRect();
                      const centerX = window.innerWidth / 2;
                      const centerY = window.innerHeight / 2;
                      setModalOrigin({
                        x: rect.left + rect.width / 2 - centerX,
                        y: rect.top + rect.height / 2 - centerY,
                      });
                    }
                    setSettingsOpen(true);
                  }}
                >
                  <FaCog size={22} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal, toggle header on click/tap */}
        <div
          className={`w-full py-2 sm:py-6 transition-all duration-300 ${
            showHeader ? "pt-16" : "pt-0"
          }`}
          onClick={(e) => {
            if (
              e.target.tagName === "BUTTON" ||
              e.target.tagName === "A" ||
              e.target.closest("button") ||
              e.target.closest("a") ||
              e.target.closest('[data-chapter-select="true"]')
            ) {
              return;
            }
            setShowHeader(!showHeader);
          }}
        >
          {chapterImages.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              Aucune image trouvée pour ce chapitre.
            </div>
          ) : (
            <div
              className="px-0 lg:px-32 xl:px-56 2xl:px-80"
              style={{
                paddingBottom: pullHeight > 0 ? 64 + pullHeight : 64,
                willChange: "padding-bottom",
                transition: pullHeight > 0 ? "none" : "padding-bottom 0.3s",
              }}
            >
              {chapterImages.map((imageUrl, index) => (
                <div
                  key={index}
                  className="relative w-full min-h-[24rem] flex items-center justify-center"
                >
                  <img
                    src={imageUrl}
                    alt={`Page ${index + 1}`}
                    className={`w-full h-auto block mx-auto max-w-full transition-opacity duration-300 ${
                      imageLoadingStates[index] ? "opacity-0" : "opacity-100"
                    }`}
                    onLoad={() => {
                      handleImageLoad(index);
                      setLoadedPages((prev) => new Set([...prev, index]));
                    }}
                    onError={() => handleImageError(index)}
                    draggable="false"
                    style={{ maxWidth: "100vw", width: "100%" }}
                  />
                  {imageLoadingStates[index] && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                    </div>
                  )}
                </div>
              ))}
              {/* BOUTON CHAPITRE SUIVANT */}
              <NextChapterButton />
              {isMobile && (
                <div
                  style={{
                    height: 64,
                    width: "100%",
                    overflow: "visible",
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    marginTop: 48,
                    pointerEvents: "auto",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 64 64"
                      className="drop-shadow-lg"
                    >
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="#18181b"
                        stroke={
                          pullHeight >= triggerPull ? "#38d46a" : "#edf060"
                        }
                        strokeWidth="4"
                        opacity="0.7"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke={
                          pullHeight >= triggerPull ? "#38d46a" : "#edf060"
                        }
                        strokeWidth="6"
                        strokeDasharray={2 * Math.PI * 28}
                        strokeDashoffset={
                          2 *
                          Math.PI *
                          28 *
                          Math.max(0, 1 - Math.min(1, pullHeight / triggerPull))
                        }
                        style={{
                          stroke:
                            pullHeight >= triggerPull ? "#38d46a" : "#edf060",
                        }}
                      />
                    </svg>
                    <span
                      className={`mt-1 text-xs font-semibold drop-shadow ${
                        pullHeight >= triggerPull
                          ? "text-green-400"
                          : "text-accent"
                      }`}
                    >
                      {pullHeight >= triggerPull
                        ? "Relâcher pour passer au chapitre suivant !"
                        : "Tirer pour chapitre suivant…"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Modal settings mobile animé (plus de bouton retour au manga) */}
      <AnimatePresence>
        {isMobile && settingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={() => setSettingsOpen(false)}
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.85,
                x: modalOrigin.x,
                y: modalOrigin.y,
              }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{
                opacity: 0,
                scale: 0.85,
                x: modalOrigin.x,
                y: modalOrigin.y,
              }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="bg-dark-bg rounded-xl shadow-2xl p-6 w-full max-w-xs relative mx-2 flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 text-accent text-xl font-bold hover:text-white transition cursor-pointer"
                onClick={() => setSettingsOpen(false)}
                aria-label="Fermer"
              >
                ×
              </button>
              {/* Ajoute ici d'autres options du menu si besoin */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ChapterReaderContext.Provider>
  );
}

function NextChapterButton() {
  const navigate = useNavigate();
  const { allChapters, currentChapterIndex, mangaId, slug } =
    useContext(ChapterReaderContext);

  // Trouver le prochain chapitre
  const nextChapter =
    allChapters && currentChapterIndex > 0
      ? allChapters[currentChapterIndex - 1]
      : null;

  const [coverImg, setCoverImg] = React.useState(null);

  React.useEffect(() => {
    let cancelled = false;
    async function fetchCover() {
      if (!nextChapter) return;
      try {
        const res = await fetch(`/chapter-image/${nextChapter.id}`);
        const data = await res.json();
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
          if (!cancelled) setCoverImg(url);
        } else {
          setCoverImg(null);
        }
      } catch {
        setCoverImg(null);
      }
    }
    fetchCover();
    return () => {
      cancelled = true;
    };
  }, [nextChapter]);

  if (!nextChapter)
    return (
      <div className="flex justify-center mt-8 m-3">
        <div className="bg-gray-800 text-white rounded-md shadow px-3 py-4 max-w-md w-full text-center flex flex-col items-center">
          <div className="font-bold text-base mb-1">Fin de la lecture</div>
          <div className="text-sm text-gray-300 mb-3">
            Il n'y a pas de chapitre suivant disponible pour le moment.
          </div>
          <img
            src={logo}
            alt="Logo WebComInk"
            className="w-16 h-16 mt-2 opacity-80"
          />
        </div>
      </div>
    );

  return (
    <div className="flex justify-center mt-8 m-3 ">
      <button
        onClick={() =>
          navigate(`/Comics/${mangaId}/${slug}/chapter/${nextChapter.id}`)
        }
        className="flex items-center gap-2 bg-gray-800 text-white rounded-md shadow px-3 py-2 md:px-3 md:py-3 hover:bg-gray-700 transition text-left max-w-md md:max-w-xl w-full cursor-pointer"
        style={{
          minHeight: 80,
          ...(window.innerWidth >= 768 ? { minHeight: 90 } : {}),
        }}
      >
        {coverImg ? (
          <img
            src={coverImg}
            alt="Prochain chapitre"
            className="w-12 h-16 md:w-16 md:h-20 object-cover rounded shadow"
            style={{ minWidth: window.innerWidth >= 768 ? 64 : 48 }}
          />
        ) : (
          <div className="w-12 h-16 md:w-16 md:h-20 bg-gray-700 rounded flex items-center justify-center text-gray-400 text-2xl">
            ?
          </div>
        )}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center gap-0 md:gap-2 mb-0.5">
            <span className="font-bold text-base md:text-base">
              Chapitre suivant :
            </span>
            <span className="text-accent text-sm md:text-base font-semibold">
              N° {nextChapter.attributes.chapter || "?"}
            </span>
          </div>
          <div className="text-sm md:text-base font-semibold truncate text-accent">
            {nextChapter.attributes.title && (
              <span
                className=" text-gray-300 md:text-base "
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "100%",
                }}
              >
                {(() => {
                  const words = nextChapter.attributes.title.split(" ");
                  return words.length > 8
                    ? words.slice(0, 8).join(" ") + "…"
                    : nextChapter.attributes.title;
                })()}
              </span>
            )}
          </div>
          <div className="text-xs md:text-sm text-gray-400 mt-1">
            Clique pour continuer la lecture !
          </div>
        </div>
      </button>
    </div>
  );
}
