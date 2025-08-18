import { useState, useEffect, useRef } from "react";

export const useImageLazyLoading = (
  chapterImages,
  currentPageIndex,
  readingMode
) => {
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [visibleImages, setVisibleImages] = useState(new Set());
  const observerRef = useRef(null);

  // Calculer quelles images sont visibles selon le mode de lecture
  const getVisibleImageIndexes = () => {
    if (!chapterImages.length) return [];

    const indexes = [];
    const buffer = 2; // Charger 2 images avant et après la page actuelle

    if (readingMode === "webtoon") {
      // En mode webtoon, charger les images autour de la position de scroll
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const estimatedImageHeight = 800; // Estimation de la hauteur d'une image

      const currentImageIndex = Math.floor(
        scrollPosition / estimatedImageHeight
      );

      for (
        let i = Math.max(0, currentImageIndex - buffer);
        i <= Math.min(chapterImages.length - 1, currentImageIndex + buffer);
        i++
      ) {
        indexes.push(i);
      }
    } else {
      // En mode manga/comics, charger la page actuelle + buffer
      for (
        let i = Math.max(0, currentPageIndex - buffer);
        i <= Math.min(chapterImages.length - 1, currentPageIndex + buffer);
        i++
      ) {
        indexes.push(i);
      }
    }

    return indexes;
  };

  // Mettre à jour les images visibles
  useEffect(() => {
    const visibleIndexes = getVisibleImageIndexes();
    setVisibleImages(new Set(visibleIndexes));
  }, [currentPageIndex, chapterImages.length, readingMode]);

  // Précharger les images visibles
  useEffect(() => {
    const preloadImage = (index) => {
      if (loadedImages.has(index) || !chapterImages[index]) return;

      const img = new Image();
      img.onload = () => {
        setLoadedImages((prev) => new Set([...prev, index]));
      };
      img.onerror = () => {};
      img.src = chapterImages[index];
    };

    // Précharger les images visibles
    visibleImages.forEach((index) => {
      preloadImage(index);
    });
  }, [visibleImages, chapterImages, loadedImages]);

  // Nettoyer les images non visibles de la mémoire (optionnel)
  const cleanupUnusedImages = () => {
    const visibleIndexes = getVisibleImageIndexes();
    const newLoadedImages = new Set();

    visibleIndexes.forEach((index) => {
      if (loadedImages.has(index)) {
        newLoadedImages.add(index);
      }
    });

    setLoadedImages(newLoadedImages);
  };

  // Optimisation : nettoyer périodiquement
  useEffect(() => {
    const interval = setInterval(cleanupUnusedImages, 30000); // Toutes les 30 secondes
    return () => clearInterval(interval);
  }, [loadedImages, visibleImages]);

  return {
    loadedImages,
    visibleImages,
    isImageLoaded: (index) => loadedImages.has(index),
    isImageVisible: (index) => visibleImages.has(index),
    preloadImage: (index) => {
      if (!loadedImages.has(index) && chapterImages[index]) {
        const img = new Image();
        img.onload = () => {
          setLoadedImages((prev) => new Set([...prev, index]));
        };
        img.src = chapterImages[index];
      }
    },
  };
};
