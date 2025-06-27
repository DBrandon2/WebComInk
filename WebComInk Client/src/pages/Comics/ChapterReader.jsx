import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaHome, FaList } from "react-icons/fa";

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
        if (imageData.chapter && imageData.chapter.data && imageData.baseUrl) {
          const images = imageData.chapter.data.map(
            (filename) =>
              `${imageData.baseUrl}/data/${imageData.chapter.hash}/${filename}`
          );
          setChapterImages(images);

          // Initialiser les états de chargement des images
          const initialLoadingStates = {};
          images.forEach((_, index) => {
            initialLoadingStates[index] = true;
          });
          setImageLoadingStates(initialLoadingStates);
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
        const response = await fetch(
          `https://api.mangadx.org/chapter?manga=${mangaId}&limit=100&order[chapter]=desc`
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

    if (mangaId) {
      fetchAllChapters();
    }
  }, [mangaId, chapterId]);

  // Chargement séquentiel des pages
  useEffect(() => {
    if (chapterImages.length === 0) return;

    const loadPagesSequentially = async () => {
      for (let i = 0; i < chapterImages.length; i++) {
        // Attendre un petit délai entre chaque page pour éviter de surcharger
        if (i > 0) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        setLoadedPages((prev) => new Set([...prev, i]));
      }
    };

    loadPagesSequentially();
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

  const goToPreviousChapter = () => {
    if (currentChapterIndex > 0) {
      const prevChapter = allChapters[currentChapterIndex - 1];
      navigate(`/Comics/${mangaId}/${slug}/chapter/${prevChapter.id}`);
    }
  };

  const goToNextChapter = () => {
    if (currentChapterIndex < allChapters.length - 1) {
      const nextChapter = allChapters[currentChapterIndex + 1];
      navigate(`/Comics/${mangaId}/${slug}/chapter/${nextChapter.id}`);
    }
  };

  // Synchronisation de la navbar mobile du site avec l'état showHeader
  useEffect(() => {
    if (!showHeader) {
      document.body.classList.add("immersive-reader-ui");
    } else {
      document.body.classList.remove("immersive-reader-ui");
    }
    return () => {
      document.body.classList.remove("immersive-reader-ui");
    };
  }, [showHeader]);

  // Masquer la navbar desktop du site sur toute la page de lecture
  useEffect(() => {
    document.body.classList.add("immersive-reader-desktop");
    return () => {
      document.body.classList.remove("immersive-reader-desktop");
    };
  }, []);

  // Gestion du scroll en slide pour desktop
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" });
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        window.scrollBy({ top: -window.innerHeight * 0.8, behavior: "smooth" });
      }
    };

    // Ajouter les écouteurs d'événements
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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

  return (
    <div className="min-h-screen bg-dark-bg mt-[-12px]">
      {/* Header de navigation, affiché seulement si showHeader */}
      <div
        className={`fixed top-0 left-0 w-full z-50 bg-dark-bg/95 backdrop-blur-sm border-b border-accent/30 transition-opacity duration-300 ${
          showHeader
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="text-accent hover:text-accent/80 transition"
                title="Accueil"
              >
                <FaHome size={20} />
              </Link>
              <Link
                to={`/Comics/${mangaId}/${slug}`}
                className="text-accent hover:text-accent/80 transition"
                title="Retour au manga"
              >
                <FaList size={20} />
              </Link>
              <div className="text-sm text-gray-400">
                <span className="hidden sm:inline">{mangaTitle} - </span>
                Chapitre {chapter?.attributes?.chapter || "?"}
                {chapter?.attributes?.title && (
                  <span className="hidden md:inline">
                    {" "}
                    : {chapter.attributes.title}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={goToPreviousChapter}
                disabled={currentChapterIndex <= 0}
                className="p-2 bg-accent text-dark-bg rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/80 transition"
                title="Chapitre précédent"
              >
                <FaArrowLeft size={16} />
              </button>
              <button
                onClick={goToNextChapter}
                disabled={currentChapterIndex >= allChapters.length - 1}
                className="p-2 bg-accent text-dark-bg rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/80 transition"
                title="Chapitre suivant"
              >
                <FaArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal, toggle header on click/tap */}
      <div
        className="w-full py-6 pt-16"
        onClick={(e) => {
          const newShowHeader = !showHeader;
          setShowHeader(newShowHeader);
          window.dispatchEvent(
            new CustomEvent("toggle-scrolltotop", {
              detail: { showHeader: newShowHeader },
            })
          );
        }}
      >
        {chapterImages.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            Aucune image trouvée pour ce chapitre.
          </div>
        ) : (
          <div className="lg:px-16 xl:px-24">
            {chapterImages.map((imageUrl, index) => (
              <div key={index} className="relative bg-white overflow-hidden">
                {imageLoadingStates[index] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                  </div>
                )}

                {loadedPages.has(index) && (
                  <img
                    src={imageUrl}
                    alt={`Page ${index + 1}`}
                    className="w-screen lg:w-auto lg:max-w-full h-auto block mx-auto"
                    onLoad={() => handleImageLoad(index)}
                    onError={() => handleImageError(index)}
                    draggable="false"
                  />
                )}

                {!loadedPages.has(index) && (
                  <div className="w-full h-96 bg-gray-800 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-2"></div>
                      <span className="text-gray-500">Chargement ...</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Navigation en bas */}
        <div className="flex justify-center items-center gap-4 mt-8 py-6">
          <button
            onClick={goToPreviousChapter}
            disabled={currentChapterIndex <= 0}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-dark-bg rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/80 transition"
          >
            <FaArrowLeft size={16} />
            <span className="hidden sm:inline">Chapitre précédent</span>
            <span className="sm:hidden">Précédent</span>
          </button>

          <Link
            to={`/Comics/${mangaId}/${slug}`}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
          >
            <span className="hidden sm:inline">Liste des chapitres</span>
            <span className="sm:hidden">Liste</span>
          </Link>

          <button
            onClick={goToNextChapter}
            disabled={currentChapterIndex >= allChapters.length - 1}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-dark-bg rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/80 transition"
          >
            <span className="hidden sm:inline">Chapitre suivant</span>
            <span className="sm:hidden">Suivant</span>
            <FaArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
