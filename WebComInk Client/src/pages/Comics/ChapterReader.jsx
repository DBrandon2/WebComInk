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
import { markChapterAsRead } from "../../apis/auth.api";
import { getMangaById } from "../../utils/mangaUtils";
import ChapterComments from "../../components/shared/ChapterComments";
import ReactDOM from "react-dom";
import CustomSelect from "../../components/shared/CustomSelect";
import { useMotionValue, useAnimation } from "framer-motion";

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
  const [isTitleLoading, setIsTitleLoading] = useState(false);

  // Index de la page actuelle pour les modes manga et comics
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  // Pour l'animation de swipe
  const [swipeDirection, setSwipeDirection] = useState(0);
  const [animPageIndex, setAnimPageIndex] = useState(currentPageIndex);
  // Pour le swipe animé façon carrousel
  const x = useMotionValue(0);
  const controls = useAnimation();
  const [isDragging, setIsDragging] = useState(false);
  const SWIPE_THRESHOLD = 80;

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // Récupérer le mode de settings (global ou individuel)
  const readerSettingsMode = (() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("readerSettingsMode") || "global";
    }
    return "global";
  })();

  // Initialisation de la marge selon le mode (stockée et affichée de 0 à 100)
  const [readerMargin, setReaderMargin] = useState(() => {
    if (typeof window === "undefined") return 0;
    const mangaId = window.location.pathname.split("/")[3];
    let val = 0;
    if (readerSettingsMode === "per-manga" && mangaId) {
      val = localStorage.getItem(`readerMargin_${mangaId}`);
    } else {
      val = localStorage.getItem("readerMargin");
    }
    if (val !== null && !isNaN(parseFloat(val))) {
      return Math.max(0, Math.min(100, parseFloat(val)));
    }
    return 0;
  });

  // Initialisation du mode de lecture
  const [readingMode, setReadingMode] = useState(() => {
    if (typeof window === "undefined") return "webtoon";
    const mangaId = window.location.pathname.split("/")[3];
    let mode = "webtoon";
    if (readerSettingsMode === "per-manga" && mangaId) {
      mode = localStorage.getItem(`readingMode_${mangaId}`);
    } else {
      mode = localStorage.getItem("readingMode");
    }
    return mode && ["webtoon", "manga", "comics"].includes(mode)
      ? mode
      : "webtoon";
  });

  // Sauvegarder la marge dans la bonne clé selon le mode (toujours de 0 à 100)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mangaId = window.location.pathname.split("/")[3];
    const val = Math.max(0, Math.min(100, readerMargin));
    if (readerSettingsMode === "per-manga" && mangaId) {
      localStorage.setItem(`readerMargin_${mangaId}`, val.toString());
    } else {
      localStorage.setItem("readerMargin", val.toString());
    }
  }, [readerMargin, readerSettingsMode]);

  // Sauvegarder le mode de lecture dans la bonne clé selon le mode
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mangaId = window.location.pathname.split("/")[3];
    if (readerSettingsMode === "per-manga" && mangaId) {
      localStorage.setItem(`readingMode_${mangaId}`, readingMode);
    } else {
      localStorage.setItem("readingMode", readingMode);
    }
  }, [readingMode, readerSettingsMode]);

  // Hook useDrag (mobile only)
  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;
  // Drag vertical (pull-to-refresh) uniquement en mode webtoon
  const bind = useDrag(
    ({ down, movement: [, my], last, event }) => {
      if (!isMobile || readingMode !== "webtoon") return;
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const isNearBottom = docHeight - scrollTop <= SCROLL_TOLERANCE;
      if (!isNearBottom) {
        if (pullHeight !== 0) setPullHeight(0); // reset si on n'est pas en bas
        return;
      }
      if (down && my < 0) {
        // Le cercle suit toujours le drag, même si on dépasse triggerPull puis on revient en arrière
        const resistance = -my / 2;
        setPullHeight(Math.max(0, Math.min(maxPull, resistance)));
      } else if (last) {
        // Passage au chapitre suivant uniquement si relâché au-delà du seuil
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
        // Sinon, reset simplement
        setPullHeight(0);
      }
    },
    { pointer: { touch: true }, enabled: isMobile && readingMode === "webtoon" }
  );

  const bindSwipe = useDrag(
    ({ down, movement: [mx], last }) => {
      if (!isMobile || readingMode === "webtoon") return;
      setIsDragging(down);
      x.set(down ? mx : 0);
      if (down) return;
      // Fin du drag
      if (Math.abs(mx) > SWIPE_THRESHOLD) {
        // Swipe validé
        if (mx < 0) {
          // Swipe gauche → page suivante (manga = droite, comics = droite)
          if (
            (readingMode === "manga" && currentPageIndex > 0) ||
            (readingMode !== "manga" &&
              currentPageIndex < chapterImages.length - 1)
          ) {
            controls
              .start({
                x: -window.innerWidth,
                opacity: 0,
                transition: { duration: 0.18, ease: "linear" },
              })
              .then(() => {
                x.set(0);
                if (readingMode === "manga") {
                  goToPreviousPage();
                } else {
                  goToNextPage();
                }
                controls.set({ x: window.innerWidth, opacity: 0 });
                controls.start({
                  x: 0,
                  opacity: 1,
                  transition: { duration: 0.18, ease: "linear" },
                });
              });
          } else {
            controls.start({
              x: 0,
              transition: { duration: 0.18, ease: "linear" },
            });
          }
        } else {
          // Swipe droite → page précédente (manga = gauche, comics = gauche)
          if (
            (readingMode === "manga" &&
              currentPageIndex < chapterImages.length - 1) ||
            (readingMode !== "manga" && currentPageIndex > 0)
          ) {
            controls
              .start({
                x: window.innerWidth,
                opacity: 0,
                transition: { duration: 0.18, ease: "linear" },
              })
              .then(() => {
                x.set(0);
                if (readingMode === "manga") {
                  goToNextPage();
                } else {
                  goToPreviousPage();
                }
                controls.set({ x: -window.innerWidth, opacity: 0 });
                controls.start({
                  x: 0,
                  opacity: 1,
                  transition: { duration: 0.18, ease: "linear" },
                });
              });
          } else {
            controls.start({
              x: 0,
              transition: { duration: 0.18, ease: "linear" },
            });
          }
        }
      } else {
        // Swipe trop court, retour à la position initiale
        controls.start({
          x: 0,
          transition: { duration: 0.18, ease: "linear" },
        });
      }
    },
    { pointer: { touch: true }, enabled: isMobile }
  );

  // Synchronise l'index d'image pour l'animation
  useEffect(() => {
    setAnimPageIndex(currentPageIndex);
  }, [currentPageIndex]);

  // Récupération des métadonnées du chapitre
  useEffect(() => {
    async function fetchChapter() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${API_BASE_URL}/proxy/chapter/${chapterId}`
        );
        if (!response.ok) {
          throw new Error("Chapitre non trouvé");
        }

        const data = await response.json();
        setChapter(data.data);

        // Récupération des données d'images
        const imageResponse = await fetch(
          `${API_BASE_URL}/proxy/chapter-image/${chapterId}`
        );
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
          `${API_BASE_URL}/proxy/chapter-list?manga=${mangaId}&limit=100&order[chapter]=desc&includes[]=scanlation_group&translatedLanguage[]=${lang}`
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
            // Utilise le proxy backend pour récupérer les infos du manga
            const mangaData = await getMangaById(mangaRelation.id);
            setMangaTitle(
              mangaData?.attributes?.title?.fr ||
                mangaData?.attributes?.title?.en ||
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

  // Navigation des pages pour les modes manga et comics
  const goToNextPage = () => {
    if (currentPageIndex < chapterImages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    } else {
      // Fin du chapitre, passer au chapitre suivant
      goToNextChapter();
    }
  };

  const goToPreviousPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    } else {
      // Début du chapitre, passer au chapitre précédent
      goToPreviousChapter();
    }
  };

  // Reset de l'index de page lors du changement de chapitre
  useEffect(() => {
    setCurrentPageIndex(0);
  }, [chapterId]);

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
        fetch(`${API_BASE_URL}/proxy/chapter-image/${nextChapter.id}`)
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

  // Enregistrer la lecture dans l'historique utilisateur
  useEffect(() => {
    if (!chapter || !chapterId || !mangaId) return;
    let cancelled = false;
    async function fetchAndMark() {
      setIsTitleLoading(true);
      let titleToSend = mangaTitle && mangaTitle.trim() ? mangaTitle : null;
      if (!titleToSend) {
        // On tente de récupérer le titre via le proxy backend
        try {
          const mangaData = await getMangaById(mangaId);
          titleToSend =
            mangaData?.attributes?.title?.fr ||
            mangaData?.attributes?.title?.en ||
            mangaData?.attributes?.title?.ja ||
            "";
        } catch {
          titleToSend = "";
        }
      }
      setIsTitleLoading(false);
      // On n'appelle markChapterAsRead que si le titre est vraiment connu
      if (!titleToSend || titleToSend === "Titre inconnu") {
        console.warn(
          "[markChapterAsRead] Titre du manga inconnu, on n'enregistre pas la lecture pour éviter l'historique vide."
        );
        return;
      }
      const coverRel = chapter?.relationships?.find(
        (r) => r.type === "cover_art"
      );
      const coverImage = coverRel?.attributes?.fileName
        ? `https://uploads.mangadex.org/covers/${mangaId}/${coverRel.attributes.fileName}.256.jpg`
        : undefined;
      const chapterNumber = chapter?.attributes?.chapter || "";
      const chapterTitle = chapter?.attributes?.title || "";
      // Log détaillé
      console.log("[DEBUG markChapterAsRead] mangaId:", mangaId);
      console.log("[DEBUG markChapterAsRead] mangaTitle:", titleToSend);
      console.log("[DEBUG markChapterAsRead] mangaSlug:", slug);
      console.log("[DEBUG markChapterAsRead] coverImage:", coverImage);
      console.log("[DEBUG markChapterAsRead] chapterId:", chapterId);
      console.log("[DEBUG markChapterAsRead] chapterNumber:", chapterNumber);
      console.log("[DEBUG markChapterAsRead] chapterTitle:", chapterTitle);
      const payload = {
        mangaId,
        mangaTitle: titleToSend,
        mangaSlug: slug || "",
        coverImage,
        chapterId,
        chapterNumber,
        chapterTitle,
        progress: 100,
      };
      console.log("[markChapterAsRead] Données envoyées :", payload);
      markChapterAsRead(payload)
        .then((res) => {
          console.log("[markChapterAsRead] Réponse :", res);
        })
        .catch((err) => {
          console.error("[markChapterAsRead] Erreur :", err);
        });
    }
    fetchAndMark();
    return () => {
      cancelled = true;
    };
  }, [chapterId, chapter, mangaId, slug, mangaTitle]);

  // Gestion du scroll et navigation clavier
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignorer si on est dans un input
      if (e.target.tagName === "INPUT") return;

      if (readingMode === "webtoon") {
        // Mode webtoon : navigation verticale
        if (e.key === "ArrowDown" || e.key === "PageDown") {
          e.preventDefault();
          window.scrollBy({
            top: window.innerHeight * 0.8,
            behavior: "smooth",
          });
        } else if (e.key === "ArrowUp" || e.key === "PageUp") {
          e.preventDefault();
          window.scrollBy({
            top: -window.innerHeight * 0.8,
            behavior: "smooth",
          });
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          goToPreviousChapter();
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          goToNextChapter();
        }
      } else {
        // Modes manga et comics : navigation page par page
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          if (readingMode === "manga") {
            goToNextPage(); // Manga : gauche = suivant
          } else {
            goToPreviousPage(); // Comics : gauche = précédent
          }
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          if (readingMode === "manga") {
            goToPreviousPage(); // Manga : droite = précédent
          } else {
            goToNextPage(); // Comics : droite = suivant
          }
        } else if (e.key === "ArrowUp" || e.key === "PageUp") {
          e.preventDefault();
          goToPreviousPage();
        } else if (e.key === "ArrowDown" || e.key === "PageDown") {
          e.preventDefault();
          goToNextPage();
        }
      }

      if (e.key === "c" || e.key === "C") {
        e.preventDefault();
        setShowChapterSelector(true);
      } else if (e.key === "Escape") {
        setShowChapterSelector(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    currentChapterIndex,
    allChapters.length,
    readingMode,
    currentPageIndex,
    chapterImages.length,
  ]);

  // --- Carrousel façon Tachiyomi ---
  const BUFFER_SIZE = 2; // nombre d'images avant/après à bufferiser
  // Calcule le buffer d'index autour de la page courante
  const getBufferIndexes = () => {
    const indexes = [];
    for (let i = -BUFFER_SIZE; i <= BUFFER_SIZE; i++) {
      const idx = currentPageIndex + i;
      if (idx >= 0 && idx < chapterImages.length) indexes.push(idx);
    }
    return indexes;
  };
  const bufferIndexes = getBufferIndexes();

  // Préchargement des images du buffer
  useEffect(() => {
    bufferIndexes.forEach((idx) => {
      const url = chapterImages[idx];
      if (!url) return;
      const img = new window.Image();
      img.src = `${API_BASE_URL}/proxy/image?url=${encodeURIComponent(url)}`;
    });
  }, [currentPageIndex, chapterImages]);

  // Carrousel horizontal
  const [carouselX, setCarouselX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const carouselRef = useRef();

  // Largeur d'une page (en px)
  const getPageWidth = () => {
    if (!carouselRef.current) return window.innerWidth;
    return carouselRef.current.offsetWidth;
  };

  // Snap à la page la plus proche
  const snapToPage = (targetIdx) => {
    setCarouselX(-getPageWidth() * (targetIdx - bufferIndexes[0]));
  };

  // Drag/swipe natif
  const bindTachiSwipe = useDrag(
    ({ down, movement: [mx], velocity, direction: [dx], last }) => {
      if (!isMobile || readingMode === "webtoon") return;
      setDragging(down);
      const pageWidth = getPageWidth();
      // Position du carrousel pendant le drag
      if (down) {
        setCarouselX(-pageWidth * (currentPageIndex - bufferIndexes[0]) + mx);
      } else {
        // Fin du drag : snap à la page la plus proche
        let newIdx = currentPageIndex;
        if (Math.abs(mx) > pageWidth * 0.18 || velocity > 0.5) {
          // Si on est à la dernière page et swipe vers la droite (ou gauche en manga), on change de chapitre SANS animation de slide
          if (mx < 0) {
            if (
              currentPageIndex === chapterImages.length - 1 &&
              allChapters &&
              currentChapterIndex > 0
            ) {
              // Dernière page, swipe vers la droite → chapitre suivant
              const nextChapter = allChapters[currentChapterIndex - 1];
              if (nextChapter) {
                navigate(
                  `/Comics/${mangaId}/${slug}/chapter/${nextChapter.id}`
                );
                return;
              }
            } else if (currentPageIndex < chapterImages.length - 1) {
              newIdx = currentPageIndex + 1;
            }
          } else if (mx > 0) {
            if (
              currentPageIndex === 0 &&
              allChapters &&
              currentChapterIndex < allChapters.length - 1
            ) {
              // Première page, swipe vers la gauche → chapitre précédent
              const prevChapter = allChapters[currentChapterIndex + 1];
              if (prevChapter) {
                navigate(
                  `/Comics/${mangaId}/${slug}/chapter/${prevChapter.id}`
                );
                return;
              }
            } else if (currentPageIndex > 0) {
              newIdx = currentPageIndex - 1;
            }
          }
        }
        // Animation douce vers la page cible (sauf si on change de chapitre)
        if (newIdx !== currentPageIndex) {
          const targetX = -pageWidth * (newIdx - bufferIndexes[0]);
          const anim = {
            x: targetX,
            transition: { duration: 0.22, ease: "easeOut" },
          };
          setCarouselX(targetX);
          controls.start(anim);
          setTimeout(() => setCurrentPageIndex(newIdx), 120);
        } else {
          // Snap retour si pas de changement de page
          const targetX = -pageWidth * (currentPageIndex - bufferIndexes[0]);
          const anim = {
            x: targetX,
            transition: { duration: 0.22, ease: "easeOut" },
          };
          setCarouselX(targetX);
          controls.start(anim);
        }
      }
    },
    { pointer: { touch: true }, enabled: isMobile && readingMode !== "webtoon" }
  );

  // Met à jour la position du carrousel quand la page change
  useEffect(() => {
    setCarouselX(-getPageWidth() * (currentPageIndex - bufferIndexes[0]));
  }, [currentPageIndex, chapterImages.length]);

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

  // Cas fin de lecture (chapitre non trouvé)
  if (currentChapterIndex === -1) {
    return (
      <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center">
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
        className="min-h-screen bg-dark-bg mt-[-12px] overflow-x-hidden "
        style={{ paddingBottom: 128 }}
        {...bind()}
      >
        {/* Header de navigation, affiché seulement si showHeader */}
        <div
          className={`fixed top-0 left-0 w-full z-50 bg-dark-bg/25 backdrop-blur-lg shadow-lg transition-opacity duration-300 ${
            showHeader
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="w-full px-3 md:px-16 py-2 md:py-3 relative flex flex-col gap-2">
            {/* Top bar responsive */}
            {/* Mobile : tout sur une ligne */}
            <div className="flex items-center w-full justify-between gap-x-2 md:hidden">
              {/* Bouton retour */}
              <div className="flex items-center min-w-0">
                <Link
                  to={`/Comics/${mangaId}/${slug}`}
                  className="flex items-center gap-2 px-3 py-2 rounded text-white hover:bg-accent hover:text-dark-bg transition text-sm font-semibold"
                  title="Retour au manga"
                >
                  <span className="text-[20px] flex items-center">
                    <Grip />
                  </span>
                </Link>
              </div>
              {/* Selecteur chapitre réduit */}
              <div className="flex items-center flex-1 min-w-0 max-w-[160px] mx-2">
                <button
                  onClick={goToPreviousChapter}
                  disabled={currentChapterIndex >= allChapters.length - 1}
                  className="w-8 h-8 bg-accent text-dark-bg rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/80 transition shadow items-center justify-center cursor-pointer mr-2"
                  title="Chapitre précédent (←)"
                >
                  <FaArrowLeft size={18} />
                </button>
                <div className="min-w-0 flex items-center justify-center flex-1">
                  <ChapterSelectorDropdown direction="down" />
                </div>
                <button
                  onClick={goToNextChapter}
                  disabled={currentChapterIndex <= 0}
                  className="w-8 h-8 bg-accent text-dark-bg rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/80 transition shadow items-center justify-center cursor-pointer ml-2"
                  title="Chapitre suivant (→)"
                >
                  <FaArrowRight size={18} />
                </button>
              </div>
              {/* Bouton settings */}
              <div className="flex items-center min-w-[40px] justify-end ml-2">
                <button
                  ref={settingsBtnRef}
                  className="p-2 bg-white/10 backdrop-blur-xl backdrop-saturate-150 border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.25)] text-white rounded-full hover:bg-white/20 transition-colors duration-200 cursor-pointer"
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
            {/* Desktop : retour à gauche, selecteur centré absolument, settings à droite */}
            <div className="hidden md:flex items-center w-full relative">
              {/* Logo + bouton retour à gauche */}
              <div className="flex items-center min-w-0">
                <div className="flex items-center min-w-[60px] mr-2">
                  <Link to="/" className="flex items-center" title="Accueil">
                    <img
                      src={logo}
                      alt="Logo"
                      className="w-10 h-10 md:w-14 md:h-14 object-contain transition-transform duration-300 ease-in-out transform hover:scale-120 hover:rotate-[-5deg] z-50"
                    />
                  </Link>
                </div>
                <div className="flex items-center min-w-[40px]">
                  <Link
                    to={`/Comics/${mangaId}/${slug}`}
                    className="flex items-center gap-2 px-3 py-2 rounded text-white hover:bg-accent hover:text-dark-bg transition text-sm font-semibold"
                    title="Retour au manga"
                  >
                    <span className="text-[28px] flex items-center">
                      <Grip />
                    </span>
                    <span className="hidden xl:inline">Retour au manga</span>
                  </Link>
                </div>
              </div>
              {/* Selecteur centré absolument, unique, centré verticalement */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center min-w-0 w-[min(420px,90vw)] h-full">
                <button
                  onClick={goToPreviousChapter}
                  disabled={currentChapterIndex >= allChapters.length - 1}
                  className="w-8 h-8 bg-accent text-dark-bg rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/80 transition shadow flex items-center justify-center cursor-pointer mr-2"
                  title="Chapitre précédent (←)"
                >
                  <FaArrowLeft size={18} />
                </button>
                <div className="min-w-0 flex items-center justify-center flex-1">
                  <ChapterSelectorDropdown direction="down" />
                </div>
                <button
                  onClick={goToNextChapter}
                  disabled={currentChapterIndex <= 0}
                  className="w-8 h-8 bg-accent text-dark-bg rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/80 transition shadow flex items-center justify-center cursor-pointer ml-2"
                  title="Chapitre suivant (→)"
                >
                  <FaArrowRight size={18} />
                </button>
              </div>
              {/* Bouton settings à droite */}
              <div className="flex items-center min-w-[40px] justify-end ml-auto">
                <button
                  ref={settingsBtnRef}
                  className="p-3 bg-white/10 backdrop-blur-xl backdrop-saturate-150 border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.25)] text-white rounded-full hover:bg-white/20 transition-colors duration-200 cursor-pointer"
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
          ) : readingMode === "webtoon" ? (
            <div className="px-0 lg:px-32 xl:px-56 2xl:px-80">
              {chapterImages.map((imageUrl, index) => {
                const proxiedUrl = `${API_BASE_URL}/proxy/image?url=${encodeURIComponent(
                  imageUrl
                )}`;
                const marginValue = (readerMargin / 100) * 70;
                return (
                  <div
                    key={index}
                    className="relative w-full flex items-start justify-center mb-4"
                  >
                    <img
                      src={proxiedUrl}
                      onLoad={() => handleImageLoad(index)}
                      onError={(e) => {
                        handleImageError(index);
                        e.target.src = "/default-placeholder.png";
                      }}
                      alt={`Page ${index + 1}`}
                      draggable="false"
                      style={{
                        maxWidth: "100vw",
                        width: `${100 - marginValue}%`,
                        marginLeft: `${marginValue / 2}%`,
                        marginRight: `${marginValue / 2}%`,
                      }}
                    />
                    {imageLoadingStates[index] && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full min-h-[60vh]">
              {/* Indicateur de page */}
              <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 bg-dark-bg/80 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium">
                Page {currentPageIndex + 1} / {chapterImages.length}
              </div>
              {/* Conteneur de l'image avec navigation */}
              <div className="relative w-full max-w-4xl mx-auto flex items-center justify-center">
                {/* Image principale plein écran */}
                <div
                  className="relative flex items-center justify-center w-full overflow-hidden"
                  style={{ height: "calc(100vh - 96px)" }}
                  ref={carouselRef}
                  {...(isMobile ? bindTachiSwipe() : {})}
                >
                  <motion.div
                    className="flex h-full"
                    animate={{ x: carouselX }}
                    style={{
                      width: `${bufferIndexes.length * 100}%`,
                      height: "100%",
                    }}
                    transition={{
                      duration: dragging ? 0 : 0.22,
                      ease: "easeOut",
                    }}
                  >
                    {bufferIndexes.map((idx) => (
                      <div
                        key={idx}
                        className="flex-shrink-0 flex-grow-0 w-full h-full flex items-center justify-center"
                      >
                        {chapterImages[idx] && (
                          <img
                            src={`${API_BASE_URL}/proxy/image?url=${encodeURIComponent(
                              chapterImages[idx]
                            )}`}
                            onLoad={() => {
                              handleImageLoad(idx);
                              setLoadedPages((prev) => new Set([...prev, idx]));
                            }}
                            onError={(e) => {
                              handleImageError(idx);
                              e.target.src = "/default-placeholder.png";
                            }}
                            alt={`Page ${idx + 1}`}
                            draggable="false"
                            style={{
                              height: "100%",
                              maxHeight: "100%",
                              width: "auto",
                              objectFit: "contain",
                              cursor: "pointer",
                            }}
                            className="mx-auto"
                            onClick={(e) => {
                              if (dragging) return;
                              if (idx !== currentPageIndex) return;
                              const rect =
                                e.currentTarget.getBoundingClientRect();
                              const clickX = e.clientX - rect.left;
                              const width = rect.width;
                              if (clickX < width / 3) {
                                // Clic gauche
                                if (readingMode === "manga") {
                                  goToNextPage();
                                } else {
                                  goToPreviousPage();
                                }
                              } else if (clickX > (2 * width) / 3) {
                                // Clic droit
                                if (readingMode === "manga") {
                                  goToPreviousPage();
                                } else {
                                  goToNextPage();
                                }
                              } else {
                                // Clic centre
                                setShowHeader((h) => !h);
                              }
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </div>
          )}
          {/* BOUTON CHAPITRE SUIVANT */}
          <NextChapterButton />
          {/* Section commentaires sous le chapitre */}
          <ChapterComments chapterId={chapterId} mangaId={mangaId} />
          {/* Interface mobile pour pull-to-refresh (uniquement en mode webtoon) */}
          {isMobile && readingMode === "webtoon" && (
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
                    stroke={pullHeight >= triggerPull ? "#38d46a" : "#edf060"}
                    strokeWidth="4"
                    opacity="0.7"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke={pullHeight >= triggerPull ? "#38d46a" : "#edf060"}
                    strokeWidth="6"
                    strokeDasharray={2 * Math.PI * 28}
                    strokeDashoffset={
                      2 *
                      Math.PI *
                      28 *
                      Math.max(0, 1 - Math.min(1, pullHeight / triggerPull))
                    }
                    style={{
                      stroke: pullHeight >= triggerPull ? "#38d46a" : "#edf060",
                    }}
                  />
                </svg>
                <span
                  className={`mt-1 text-xs font-semibold drop-shadow ${
                    pullHeight >= triggerPull ? "text-green-400" : "text-accent"
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
      </div>
      {/* Modale de paramètres (settings) */}
      {settingsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setSettingsOpen(false)}
        >
          <div
            className="bg-dark-bg rounded-xl shadow-2xl p-6 w-full max-w-sm relative mx-2 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-accent text-xl font-bold hover:text-white transition cursor-pointer"
              onClick={() => setSettingsOpen(false)}
              aria-label="Fermer"
            >
              ×
            </button>
            <h3 className="text-white text-lg font-semibold mb-6 mt-2">
              Paramètres du lecteur
            </h3>
            <div className="w-full space-y-6">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="readingMode"
                  className="text-white font-medium text-sm mb-1"
                >
                  Mode de lecture
                </label>
                <CustomSelect
                  options={[
                    { value: "webtoon", label: "Webtoon (vertical)" },
                    { value: "manga", label: "Manga (droite → gauche)" },
                    { value: "comics", label: "Comics (gauche → droite)" },
                  ]}
                  value={readingMode}
                  onChange={setReadingMode}
                  className="min-w-[220px] max-w-[520px] w-full"
                />
              </div>
              <SliderSetting
                label="Marge latérale"
                value={readerMargin}
                onChange={setReaderMargin}
                min={0}
                max={100}
                step={1}
                unit=""
                description="Ajuste l'espace sur les côtés des images (0 = aucune marge, 20 = image réduite à 30% de sa largeur)"
                formatValue={(val) => `${Math.round((val / 100) * 20)}/20`}
              />
            </div>
          </div>
        </div>
      )}
    </ChapterReaderContext.Provider>
  );
}

// Composant ReadingModeSelector pour choisir le mode de lecture
function ReadingModeSelector({ value, onChange }) {
  // Options de mode de lecture
  const modes = [
    { value: "webtoon", label: "Webtoon (vertical)" },
    { value: "manga", label: "Manga (droite → gauche)" },
    { value: "comics", label: "Comics (gauche → droite)" },
  ];

  // Style et logique identiques à CustomChapterSelect, mais pour options simples
  const [open, setOpen] = React.useState(false);
  const buttonRef = React.useRef(null);
  const listRef = React.useRef(null);
  const [dropdownStyle, setDropdownStyle] = React.useState({});

  React.useEffect(() => {
    function handleClickOutside(e) {
      if (
        listRef.current &&
        !listRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open]);

  React.useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: "absolute",
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        zIndex: 9999,
      });
    }
  }, [open]);

  const current = modes.find((m) => m.value === value);
  const currentLabel = current ? current.label : "Sélectionner...";

  return (
    <div
      className="relative min-w-[220px] max-w-[520px] w-full"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <button
        ref={buttonRef}
        className="bg-gray-800 text-white border border-white rounded px-4 py-2 text-base font-semibold w-full truncate shadow focus:border-white focus:outline-none cursor-pointer flex items-center justify-between gap-2"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        type="button"
      >
        <span className="truncate text-left">{currentLabel}</span>
        <svg
          className={`w-4 h-4 ml-2 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {open &&
        typeof window !== "undefined" &&
        ReactDOM.createPortal(
          <ul
            ref={listRef}
            tabIndex={-1}
            className="max-h-72 overflow-auto rounded bg-gray-900 border border-white shadow-lg animate-fade-in"
            style={dropdownStyle}
            role="listbox"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            {modes.map((mode) => (
              <li
                key={mode.value}
                role="option"
                aria-selected={mode.value === value}
                className={`px-4 py-2 cursor-pointer select-none truncate transition-colors duration-150 
                  ${
                    mode.value === value
                      ? "bg-accent/30 text-accent font-bold"
                      : "text-white"
                  }
                  hover:bg-accent/40 hover:text-accent`}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  onChange(mode.value);
                  setOpen(false);
                }}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    onChange(mode.value);
                    setOpen(false);
                  }
                }}
              >
                {mode.label}
              </li>
            ))}
          </ul>,
          document.body
        )}
    </div>
  );
}

// Composant SliderSetting pour les paramètres avec slider
function SliderSetting({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit = "",
  description,
  formatValue,
}) {
  const displayValue = formatValue ? formatValue(value) : `${value}${unit}`;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <label className="text-white font-medium text-sm">{label}</label>
        <span className="text-accent font-semibold text-sm">
          {displayValue}
        </span>
      </div>

      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #edf060 0%, #edf060 ${
              ((value - min) / (max - min)) * 100
            }%, #374151 ${((value - min) / (max - min)) * 100}%, #374151 100%)`,
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
            input[type="range"]::-webkit-slider-thumb {
              appearance: none;
              height: 18px;
              width: 18px;
              border-radius: 50%;
              background: #edf060;
              cursor: pointer;
              border: 2px solid #1f2937;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            }
            input[type="range"]::-moz-range-thumb {
              height: 18px;
              width: 18px;
              border-radius: 50%;
              background: #edf060;
              cursor: pointer;
              border: 2px solid #1f2937;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
              border: none;
            }
            input[type="range"]::-moz-range-track {
              background: transparent;
              border: none;
            }
          `,
          }}
        />
      </div>

      {description && (
        <p className="text-gray-400 text-xs mt-2">{description}</p>
      )}
    </div>
  );
}

function NextChapterButton() {
  const navigate = useNavigate();
  const { allChapters, currentChapterIndex, mangaId, slug } =
    useContext(ChapterReaderContext);

  // Déclare API_BASE_URL ici
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

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
        const res = await fetch(
          `${API_BASE_URL}/proxy/chapter-image/${nextChapter.id}`
        );
        const data = await res.json();
        // Suppression des logs debug
        if (
          data.chapter &&
          data.chapter.data &&
          data.chapter.data.length > 0 &&
          data.chapter.hash &&
          data.baseUrl
        ) {
          const files = data.chapter.data;
          let file = null;
          for (let idx of [4, 3, 2, 1, files.length - 1, 0]) {
            if (files[idx]) {
              file = files[idx];
              break;
            }
          }
          if (!file) file = files[0];
          const url = `${data.baseUrl}/data/${data.chapter.hash}/${file}`;
          if (!cancelled) setCoverImg(url);
        } else {
          setCoverImg(null);
        }
      } catch (e) {
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
