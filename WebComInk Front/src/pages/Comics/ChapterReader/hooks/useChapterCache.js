import { useState, useEffect, useRef } from "react";

export const useChapterCache = () => {
  const [cachedChapters, setCachedChapters] = useState(new Map());
  const [cachedImages, setCachedImages] = useState(new Map());
  const [cacheSize, setCacheSize] = useState(0);
  const maxCacheSize = 50 * 1024 * 1024; // 50MB max
  const maxCachedChapters = 5; // Max 5 chapitres en cache

  // Calculer la taille du cache
  const calculateCacheSize = () => {
    let totalSize = 0;
    cachedImages.forEach((imageData) => {
      totalSize += imageData.size || 0;
    });
    setCacheSize(totalSize);
  };

  // Nettoyer le cache si nécessaire
  const cleanupCache = () => {
    if (cacheSize > maxCacheSize || cachedChapters.size > maxCachedChapters) {
      // Supprimer les chapitres les plus anciens
      const chaptersArray = Array.from(cachedChapters.entries());
      const sortedChapters = chaptersArray.sort(
        (a, b) => a[1].lastAccessed - b[1].lastAccessed
      );

      const chaptersToRemove = sortedChapters.slice(
        0,
        Math.floor(sortedChapters.length / 2)
      );

      chaptersToRemove.forEach(([chapterId]) => {
        // Supprimer les images associées
        const chapterData = cachedChapters.get(chapterId);
        if (chapterData && chapterData.imageIds) {
          chapterData.imageIds.forEach((imageId) => {
            cachedImages.delete(imageId);
          });
        }
        cachedChapters.delete(chapterId);
      });

      calculateCacheSize();
    }
  };

  // Mettre en cache un chapitre
  const cacheChapter = (chapterId, chapterData) => {
    const now = Date.now();
    setCachedChapters((prev) =>
      new Map(prev).set(chapterId, {
        ...chapterData,
        lastAccessed: now,
        imageIds: [],
      })
    );

    cleanupCache();
  };

  // Mettre en cache une image
  const cacheImage = (imageId, imageUrl, imageData) => {
    const now = Date.now();
    setCachedImages((prev) =>
      new Map(prev).set(imageId, {
        url: imageUrl,
        data: imageData,
        lastAccessed: now,
        size: imageData ? new Blob([imageData]).size : 0,
      })
    );

    calculateCacheSize();
    cleanupCache();
  };

  // Récupérer un chapitre du cache
  const getCachedChapter = (chapterId) => {
    const chapter = cachedChapters.get(chapterId);
    if (chapter) {
      // Mettre à jour le timestamp d'accès
      setCachedChapters((prev) =>
        new Map(prev).set(chapterId, {
          ...chapter,
          lastAccessed: Date.now(),
        })
      );
      return chapter;
    }
    return null;
  };

  // Récupérer une image du cache
  const getCachedImage = (imageId) => {
    const image = cachedImages.get(imageId);
    if (image) {
      // Mettre à jour le timestamp d'accès
      setCachedImages((prev) =>
        new Map(prev).set(imageId, {
          ...image,
          lastAccessed: Date.now(),
        })
      );
      return image;
    }
    return null;
  };

  // Précharger le chapitre suivant
  const preloadNextChapter = async (
    currentChapterId,
    allChapters,
    currentChapterIndex
  ) => {
    if (currentChapterIndex > 0) {
      const nextChapter = allChapters[currentChapterIndex - 1];
      if (nextChapter && !cachedChapters.has(nextChapter.id)) {
        try {
          // Précharger les métadonnées du chapitre
          const response = await fetch(`/api/proxy/chapter/${nextChapter.id}`);
          const data = await response.json();
          cacheChapter(nextChapter.id, data.data);

          // Précharger la première image
          const imageResponse = await fetch(
            `/api/proxy/chapter-image/${nextChapter.id}`
          );
          const imageData = await imageResponse.json();
          if (
            imageData.chapter &&
            imageData.chapter.data &&
            imageData.chapter.data.length > 0
          ) {
            const firstImage = imageData.chapter.data[0];
            const imageUrl = `${imageData.baseUrl}/data/${imageData.chapter.hash}/${firstImage}`;
            cacheImage(`${nextChapter.id}_0`, imageUrl, null);
          }
        } catch (error) {
          // Ignorer l'erreur de préchargement
        }
      }
    }
  };

  // Nettoyer le cache périodiquement
  useEffect(() => {
    const interval = setInterval(cleanupCache, 60000); // Toutes les minutes
    return () => clearInterval(interval);
  }, []);

  return {
    cacheChapter,
    cacheImage,
    getCachedChapter,
    getCachedImage,
    preloadNextChapter,
    cacheSize,
    cachedChaptersCount: cachedChapters.size,
    cachedImagesCount: cachedImages.size,
    clearCache: () => {
      setCachedChapters(new Map());
      setCachedImages(new Map());
      setCacheSize(0);
    },
  };
};
