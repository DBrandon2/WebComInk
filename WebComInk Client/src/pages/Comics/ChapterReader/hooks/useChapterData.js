import { useState, useEffect } from "react";
import { API_BASE_URL, IMAGE_QUALITY } from "../utils/constants";
import { getImageQuality, buildImageUrl } from "../utils/readerUtils";
import { getMangaById } from "../../../../utils/mangaUtils";

export const useChapterData = (chapterId, mangaId) => {
  const [chapter, setChapter] = useState(null);
  const [chapterImages, setChapterImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoadingStates, setImageLoadingStates] = useState({});

  // Récupération des métadonnées du chapitre
  useEffect(() => {
    async function fetchChapter() {
      if (!chapterId) return;

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
          const quality = getImageQuality();
          const files =
            quality === IMAGE_QUALITY.DATA_SAVER
              ? imageData.chapter.dataSaver
              : imageData.chapter.data;
          const qualityPath =
            quality === IMAGE_QUALITY.DATA_SAVER ? "data-saver" : "data";

          if (files && Array.isArray(files)) {
            const images = files.map((filename) =>
              buildImageUrl(
                imageData.baseUrl,
                qualityPath,
                imageData.chapter.hash,
                filename
              )
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

    fetchChapter();
  }, [chapterId]);

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

  return {
    chapter,
    chapterImages,
    loading,
    error,
    imageLoadingStates,
    handleImageLoad,
    handleImageError,
  };
};

export const useAllChapters = (mangaId, chapterId, chapter) => {
  const [allChapters, setAllChapters] = useState([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(-1);
  const [mangaTitle, setMangaTitle] = useState("");

  useEffect(() => {
    async function fetchAllChapters() {
      if (!mangaId || !chapter) return;

      try {
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

    fetchAllChapters();
  }, [mangaId, chapterId, chapter]);

  return {
    allChapters,
    currentChapterIndex,
    mangaTitle,
  };
};

export const useNextChapterPreload = (allChapters, currentChapterIndex) => {
  const [nextChapterData, setNextChapterData] = useState(null);

  useEffect(() => {
    if (
      currentChapterIndex >= 0 &&
      currentChapterIndex < allChapters.length - 1
    ) {
      const nextChapter = allChapters[currentChapterIndex + 1];
      if (nextChapter && !nextChapterData) {
        fetch(`${API_BASE_URL}/proxy/chapter-image/${nextChapter.id}`)
          .then((res) => res.json())
          .then((data) => setNextChapterData(data))
          .catch(() => {}); // Ignore les erreurs de préchargement
      }
    }
  }, [currentChapterIndex, allChapters, nextChapterData]);

  return nextChapterData;
};
