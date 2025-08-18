import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMotionValue, useAnimation } from "framer-motion";
import { markChapterAsRead } from "../../../../apis/auth.api";
import { getMangaById } from "../../../../utils/mangaUtils";
import { useReaderSettings } from "./useReaderSettings";
import { useChapterData } from "./useChapterData";
import { useAllChapters } from "./useChapterData";
import { useReadingProgress } from "./useReadingProgress";
import { useKeyboardNavigation } from "./useKeyboardNavigation";
import { useGestures } from "./useGestures";
import { useImageLazyLoading } from "./useImageLazyLoading";
import { useImageQuality } from "./useImageQuality";
import { useChapterCache } from "./useChapterCache";
import { useChapterEndDetection } from "./useChapterEndDetection";
import { READING_MODES } from "../utils/constants";

export const useChapterReader = (mangaId, slug, chapterId) => {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // États principaux
  const [showHeader, setShowHeader] = useState(true);
  const [loadedPages, setLoadedPages] = useState(new Set());
  const [showChapterSelector, setShowChapterSelector] = useState(false);
  const [chapterSearchTerm, setChapterSearchTerm] = useState("");
  const [readingProgress, setReadingProgress] = useState(0);
  const [chapterProgress, setChapterProgress] = useState(0);
  const [nextChapterData, setNextChapterData] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [modalOrigin, setModalOrigin] = useState({ x: 0, y: 0 });
  const [isTitleLoading, setIsTitleLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState("next");

  // États pour la navigation des pages
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [animPageIndex, setAnimPageIndex] = useState(currentPageIndex);

  // Refs
  const carouselRef = useRef();
  const settingsBtnRef = useRef(null);

  // Hooks personnalisés
  const {
    readerMargin,
    setReaderMargin,
    readingMode,
    setReadingMode,
    readerSettingsMode,
  } = useReaderSettings();

  const {
    chapter,
    chapterImages,
    loading,
    error,
    imageLoadingStates,
    handleImageLoad,
    handleImageError,
  } = useChapterData(chapterId, mangaId);

  const { allChapters, currentChapterIndex, mangaTitle } = useAllChapters(
    mangaId,
    chapterId,
    chapter
  );

  // Nouveaux hooks d'optimisation
  const {
    loadedImages,
    visibleImages,
    isImageLoaded,
    isImageVisible,
    preloadImage,
  } = useImageLazyLoading(chapterImages, currentPageIndex, readingMode);

  const {
    imageQuality,
    connectionSpeed,
    userPreference,
    setUserQualityPreference,
    getOptimizedImageUrl,
    isHighQuality,
    isLowQuality,
  } = useImageQuality();

  const {
    cacheChapter,
    cacheImage,
    getCachedChapter,
    getCachedImage,
    preloadNextChapter,
    cacheSize,
    cachedChaptersCount,
    cachedImagesCount,
    clearCache,
  } = useChapterCache();

  // Nouveau hook de détection de fin de chapitre
  const { isNearEnd, isAtEnd, hasTriggeredEnd, chapterProgressValue } =
    useChapterEndDetection({
      currentPageIndex,
      totalPages: chapterImages.length,
      readingMode,
      onChapterEnd: () => {
        // Marquer le chapitre comme terminé quand on arrive à la fin
        if (chapter && chapterId && mangaId) {
          const payload = {
            mangaId,
            mangaTitle: mangaTitle || "",
            mangaSlug: slug || "",
            coverImage: "",
            chapterId,
            chapterNumber: chapter?.attributes?.chapter || "",
            chapterTitle: chapter?.attributes?.title || "",
            progress: 100,
          };
          markChapterAsRead(payload).catch(() => {});
        }
      },
    });

  // Fonction pour reprendre la lecture à la page sauvegardée
  const resumeReading = (savedProgress) => {
    if (savedProgress && savedProgress > 0 && savedProgress < 100) {
      const targetPage = Math.floor(
        (savedProgress / 100) * (chapterImages.length - 1)
      );
      setCurrentPageIndex(
        Math.max(0, Math.min(targetPage, chapterImages.length - 1))
      );
    }
  };

  // Constantes pour les gestes
  const maxPull = 120;
  const triggerPull = 100;
  const SCROLL_TOLERANCE = 24;
  const SWIPE_THRESHOLD = 80;

  // Motion values pour les animations
  const x = useMotionValue(0);
  const controls = useAnimation();

  // Détection mobile
  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;

  // Navigation entre chapitres avec transitions
  const goToPreviousChapter = () => {
    if (readingMode === READING_MODES.MANGA) {
      // Mode MANGA : lecture de droite à gauche, donc "précédent" = chapitre avec index plus bas
      if (currentChapterIndex > 0) {
        setTransitionDirection("prev");
        setIsTransitioning(true);

        setTimeout(() => {
          const prevChapter = allChapters[currentChapterIndex - 1];
          navigate(`/Comics/${mangaId}/${slug}/chapter/${prevChapter.id}`);
          setIsTransitioning(false);
        }, 300);
      }
    } else {
      // Mode COMICS : lecture de gauche à droite, donc "précédent" = chapitre avec index plus élevé (inverse du MANGA)
      if (currentChapterIndex < allChapters.length - 1) {
        setTransitionDirection("prev");
        setIsTransitioning(true);

        setTimeout(() => {
          const prevChapter = allChapters[currentChapterIndex + 1];
          navigate(`/Comics/${mangaId}/${slug}/chapter/${prevChapter.id}`);
          setIsTransitioning(false);
        }, 300);
      }
    }
  };

  const goToNextChapter = () => {
    if (readingMode === READING_MODES.MANGA) {
      // Mode MANGA : lecture de droite à gauche, donc "suivant" = chapitre avec index plus élevé
      if (currentChapterIndex < allChapters.length - 1) {
        setTransitionDirection("next");
        setIsTransitioning(true);

        setTimeout(() => {
          const nextChapter = allChapters[currentChapterIndex + 1];
          navigate(`/Comics/${mangaId}/${slug}/chapter/${nextChapter.id}`);
          setIsTransitioning(false);
        }, 300);
      }
    } else {
      // Mode COMICS : lecture de gauche à droite, donc "suivant" = chapitre avec index plus bas (inverse du MANGA)
      if (currentChapterIndex > 0) {
        setTransitionDirection("next");
        setIsTransitioning(true);

        setTimeout(() => {
          const nextChapter = allChapters[currentChapterIndex - 1];
          navigate(`/Comics/${mangaId}/${slug}/chapter/${nextChapter.id}`);
          setIsTransitioning(false);
        }, 300);
      }
    }
  };

  const goToChapter = (chapterId) => {
    setTransitionDirection("next");
    setIsTransitioning(true);

    setTimeout(() => {
      navigate(`/Comics/${mangaId}/${slug}/chapter/${chapterId}`);
      setShowChapterSelector(false);
      setIsTransitioning(false);
    }, 300);
  };

  // Navigation entre pages
  const goToNextPage = () => {
    const maxPage =
      readingMode === READING_MODES.WEBTOON
        ? chapterImages.length - 1
        : chapterImages.length;

    if (currentPageIndex < maxPage) {
      setCurrentPageIndex(currentPageIndex + 1);
    } else {
      // Fin du chapitre, aller au chapitre suivant
      goToNextChapter();
    }
  };

  const goToPreviousPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    } else {
      // Début du chapitre, aller au chapitre précédent
      goToPreviousChapter();
    }
  };

  // Gestion des gestes
  const { bind, bindSwipe, pullHeight, isDragging } = useGestures({
    readingMode,
    allChapters,
    currentChapterIndex,
    goToNextChapter,
    isMobile,
    maxPull,
    triggerPull,
    SCROLL_TOLERANCE,
    currentPageIndex,
    chapterImages,
    goToNextPage,
    goToPreviousPage,
    SWIPE_THRESHOLD,
    x,
    controls,
  });

  // Reset de l'index de page lors du changement de chapitre
  useEffect(() => {
    if (readingMode === READING_MODES.MANGA) {
      // En mode MANGA, pour commencer à la page 1, il faut être à l'index 5 du carousel
      setCurrentPageIndex(chapterImages.length);
    } else {
      // En mode COMICS, on commence à l'index 0
      setCurrentPageIndex(0);
    }
  }, [chapterId, readingMode, chapterImages.length]);

  // Synchronise l'index d'image pour l'animation
  useEffect(() => {
    setAnimPageIndex(currentPageIndex);
  }, [currentPageIndex]);

  // Chargement séquentiel des pages avec lazy loading
  useEffect(() => {
    if (chapterImages.length === 0) return;

    let isMounted = true;
    const loadPagesSequentially = async () => {
      let localSet = new Set();

      // Charger d'abord les images visibles
      visibleImages.forEach((index) => {
        if (!isMounted) return;
        localSet.add(index);
        setLoadedPages(new Set(localSet));
        preloadImage(index);
      });

      // Puis charger les autres images progressivement
      for (let i = 0; i < chapterImages.length; i++) {
        if (!isMounted) return;
        if (!localSet.has(i)) {
          if (i > 0) {
            await new Promise((resolve) => setTimeout(resolve, 200)); // Délai plus long pour économiser la bande passante
          }
          localSet.add(i);
          setLoadedPages(new Set(localSet));
          preloadImage(i);
        }
      }
    };
    loadPagesSequentially();
    return () => {
      isMounted = false;
    };
  }, [chapterImages, visibleImages]);

  // Synchronisation de la navbar mobile avec l'état showHeader
  useEffect(() => {
    if (!showHeader) {
      document.body.classList.add("immersive-reader-ui");
    } else {
      document.body.classList.remove("immersive-reader-ui");
    }

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

  // Masquer la navbar desktop sur toute la page de lecture
  useEffect(() => {
    document.body.classList.add("immersive-reader-desktop");
    document.body.style.overflowX = "hidden";

    return () => {
      document.body.classList.remove("immersive-reader-desktop");
      document.body.style.overflowX = "";
    };
  }, []);

  // Préchargement du chapitre suivant avec cache
  useEffect(() => {
    if (
      currentChapterIndex >= 0 &&
      currentChapterIndex < allChapters.length - 1
    ) {
      preloadNextChapter(chapterId, allChapters, currentChapterIndex);
    }
  }, [currentChapterIndex, allChapters, chapterId]);

  // Enregistrer la lecture dans l'historique utilisateur
  useEffect(() => {
    if (!chapter || !chapterId || !mangaId) return;

    // Ne pas marquer comme lu si on est encore à la première page
    // et qu'on n'a pas encore commencé à lire
    if (currentPageIndex === 0 && chapterImages.length > 0) return;

    let cancelled = false;
    async function fetchAndMark() {
      setIsTitleLoading(true);
      let titleToSend = mangaTitle && mangaTitle.trim() ? mangaTitle : null;

      if (!titleToSend) {
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

      if (!titleToSend || titleToSend === "Titre inconnu") {
        // Ignorer si le titre est inconnu pour éviter un historique vide
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

      // Calculer le progrès de lecture
      const progress = Math.round(
        (currentPageIndex / (chapterImages.length - 1)) * 100
      );

      // Ne marquer comme lu que si on a lu au moins 10% du chapitre
      // ou si on a lu au moins 2 pages
      const shouldMarkAsRead = progress >= 10 || currentPageIndex >= 2;

      const payload = {
        mangaId,
        mangaTitle: titleToSend,
        mangaSlug: slug || "",
        coverImage,
        chapterId,
        chapterNumber,
        chapterTitle,
        progress: shouldMarkAsRead ? progress : 0,
      };

      markChapterAsRead(payload).catch(() => {});
    }

    fetchAndMark();
    return () => {
      cancelled = true;
    };
  }, [
    chapterId,
    chapter,
    mangaId,
    slug,
    mangaTitle,
    currentPageIndex,
    chapterImages.length,
  ]);

  // Utilisation du hook de progression de lecture
  useReadingProgress({
    allChapters,
    currentChapterIndex,
    chapterId,
    mangaId,
    setReadingProgress,
    setChapterProgress,
  });

  // Utilisation du hook de navigation clavier
  useKeyboardNavigation(
    readingMode,
    currentPageIndex,
    chapterImages,
    goToPreviousChapter,
    goToNextChapter,
    goToNextPage,
    goToPreviousPage,
    setShowChapterSelector
  );

  // Filtrage des chapitres pour la recherche
  const filteredChapters = allChapters.filter((ch) => {
    const chapterNum = ch.attributes.chapter || "";
    const title = ch.attributes.title || "";
    const searchLower = chapterSearchTerm.toLowerCase();
    return (
      chapterNum.includes(searchLower) ||
      title.toLowerCase().includes(searchLower)
    );
  });

  // Gestion des paramètres
  const handleSettingsClick = (origin) => {
    setModalOrigin(origin);
    setSettingsOpen(true);
  };

  const closeSettings = () => {
    setSettingsOpen(false);
  };

  return {
    // États
    showHeader,
    setShowHeader,
    loadedPages,
    setLoadedPages,
    showChapterSelector,
    setShowChapterSelector,
    chapterSearchTerm,
    setChapterSearchTerm,
    readingProgress,
    chapterProgress,
    nextChapterData,
    settingsOpen,
    modalOrigin,
    isTitleLoading,
    currentPageIndex,
    setCurrentPageIndex,
    animPageIndex,
    isDragging,
    pullHeight,
    isTransitioning,
    transitionDirection,

    // Données
    chapter,
    chapterImages,
    loading,
    error,
    imageLoadingStates,
    allChapters,
    currentChapterIndex,
    mangaTitle,
    filteredChapters,

    // Paramètres
    readerMargin,
    setReaderMargin,
    readingMode,
    setReadingMode,
    readerSettingsMode,

    // Navigation
    goToPreviousChapter,
    goToNextChapter,
    goToChapter,
    goToNextPage,
    goToPreviousPage,

    // Gestion des images
    handleImageLoad,
    handleImageError,

    // Gestes
    bind,
    bindSwipe,
    x,
    controls,

    // Refs
    carouselRef,
    settingsBtnRef,

    // Utilitaires
    isMobile,

    // Paramètres
    handleSettingsClick,
    closeSettings,

    // Nouvelles optimisations
    loadedImages,
    visibleImages,
    isImageLoaded,
    isImageVisible,
    preloadImage,
    imageQuality,
    connectionSpeed,
    setUserQualityPreference,
    getOptimizedImageUrl,
    isHighQuality,
    isLowQuality,
    cacheSize,
    cachedChaptersCount,
    cachedImagesCount,
    clearCache,

    // Nouvelles optimisations UX
    isNearEnd,
    isAtEnd,
    hasTriggeredEnd,
    chapterProgressValue,
    resumeReading,
  };
};
