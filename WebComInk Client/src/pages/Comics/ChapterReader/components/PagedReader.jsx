import React, { useRef, useContext } from "react";
import { motion } from "framer-motion";
import { ChapterReaderContext } from "../context/ChapterReaderContext";
import NextChapterButton from "./NextChapterButton";
import { API_BASE_URL, READING_MODES } from "../utils/constants";
import { buildProxiedImageUrl, isMobileDevice } from "../utils/readerUtils";
import { AnimatePresence } from "framer-motion";

export default function PagedReader({
  readingMode,
  currentPageIndex,
  isDragging,
  dragX,
  bindSwipe,
  setShowHeader,
  goToNextPage,
  goToPreviousPage,
  readerMargin,
}) {
  const carouselRef = useRef();
  const {
    chapterImages,
    handleImageLoad,
    handleImageError,
    loadedPages,
    setLoadedPages,
  } = useContext(ChapterReaderContext);
  const isMobile = isMobileDevice();

  if (chapterImages.length === 0) {
    return (
      <div className="text-center text-gray-400 py-12">
        Aucune image trouvée pour ce chapitre.
      </div>
    );
  }

  // Calcul des indexes d'affichage selon le mode
  const displayIndexes =
    readingMode === READING_MODES.MANGA
      ? [...Array(chapterImages.length).keys()].reverse()
      : [...Array(chapterImages.length).keys()];

  // Pages du carrousel avec page spéciale
  const carouselPages =
    readingMode === READING_MODES.MANGA
      ? ["next-chapter-page", ...displayIndexes]
      : [...displayIndexes, "next-chapter-page"];

  const pageWidth = carouselRef.current?.offsetWidth || window.innerWidth;

  const renderImage = (pageIndex, idx) => {
    const imageUrl = chapterImages[pageIndex];
    if (!imageUrl) return null;

    const proxiedUrl = buildProxiedImageUrl(API_BASE_URL, imageUrl);
    const marginValue = (readerMargin / 100) * 70;

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <img
          src={proxiedUrl}
          onLoad={() => {
            handleImageLoad(pageIndex);
            setLoadedPages((prev) => new Set([...prev, pageIndex]));
          }}
          onError={(e) => {
            handleImageError(pageIndex);
            e.target.src = "/default-placeholder.png";
          }}
          alt={`Page ${pageIndex + 1}`}
          draggable="false"
          style={{
            height: "100%",
            maxHeight: "100%",
            width: "50%",
            objectFit: "contain",
            maxWidth: "80vw", // Réduit la largeur maximale
            ...(readerMargin !== undefined
              ? {
                  width: `${100 - marginValue}%`,
                  marginLeft: `${marginValue / 2}%`,
                  marginRight: `${marginValue / 2}%`,
                }
              : {
                  width: "auto", // Laisse l'image prendre sa taille naturelle
                  maxWidth: "80vw", // Limite la largeur
                }),
          }}
          className="mx-auto"
        />
      </div>
    );
  };

  // Fonction pour gérer la navigation par clic sur les zones latérales
  const handleZoneClick = (zone) => {
    if (isDragging) return;

    if (readingMode === READING_MODES.MANGA) {
      // Mode MANGA : lecture de droite à gauche
      if (zone === "left") {
        // Clic gauche → page précédente (dans l'ordre de lecture)
        goToPreviousPage();
      } else if (zone === "right") {
        // Clic droite → page suivante (dans l'ordre de lecture)
        goToNextPage();
      }
    } else {
      // Mode COMICS : lecture de gauche à droite
      if (zone === "left") {
        // Clic gauche → page précédente
        goToPreviousPage();
      } else if (zone === "right") {
        // Clic droite → page suivante
        goToNextPage();
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[60vh]">
      {/* Zones de navigation - couvrent toute la largeur de l'écran */}
      <div
        className="fixed left-0 top-16 w-[35%] h-[calc(100vh-96px)] z-20 cursor-pointer navigation-zone"
        onClick={() => handleZoneClick("left")}
      />

      <div
        className="fixed right-0 top-16 w-[35%] h-[calc(100vh-96px)] z-20 cursor-pointer navigation-zone"
        onClick={() => handleZoneClick("right")}
      />

      {/* Zone de clic au centre pour toggle topbar - espace entre les zones de navigation */}
      <div
        className="fixed left-[35%] top-16 w-[30%] h-[calc(100vh-96px)] z-10 cursor-pointer"
        onClick={(e) => {
          if (isDragging) return;
          e.stopPropagation();
          setShowHeader((h) => !h);
        }}
      />

      {/* Conteneur de l'image avec navigation */}
      <div className="relative w-full max-w-4xl mx-auto flex items-center justify-center">
        <div
          className="relative flex items-center justify-center w-full overflow-hidden"
          style={{ height: "calc(100vh - 96px)" }}
          ref={carouselRef}
          {...(isMobile ? bindSwipe : {})}
        >
          {isDragging ? (
            <motion.div
              className="flex h-full"
              style={{
                x: -pageWidth * currentPageIndex + dragX,
                width: `${carouselPages.length * 100}%`,
                height: "100%",
                transition: "none",
              }}
            >
              {carouselPages.map((page, idx) => {
                if (page === "next-chapter-page") {
                  return (
                    <div
                      key="next-chapter-page-dragging"
                      className="flex-shrink-0 flex-grow-0 w-full h-full flex items-center justify-center bg-dark-bg"
                    >
                      <NextChapterButton />
                    </div>
                  );
                }

                return (
                  <div
                    key={page}
                    className="flex-shrink-0 flex-grow-0 w-full h-full flex items-center justify-center"
                  >
                    {renderImage(page, idx)}
                  </div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              className="flex h-full"
              drag="x"
              dragConstraints={{
                left: -pageWidth * (carouselPages.length - 1),
                right: 0,
              }}
              dragElastic={0.1}
              dragTransition={{
                bounceStiffness: 600,
                bounceDamping: 20,
              }}
              onDragEnd={(event, info) => {
                const offset = info.offset.x;
                const velocity = info.velocity.x;
                const pageWidth = window.innerWidth;

                // Seuil pour déclencher le changement de page
                const threshold = pageWidth * 0.3;

                if (Math.abs(offset) > threshold || Math.abs(velocity) > 500) {
                  // Utilise la logique existante du carousel
                  // Le carousel gère déjà la direction selon le mode de lecture
                  if (offset > 0) {
                    // Swipe vers la droite - laisse le carousel décider
                    goToPreviousPage();
                  } else {
                    // Swipe vers la gauche - laisse le carousel décider
                    goToNextPage();
                  }
                }
              }}
              animate={{ x: -pageWidth * currentPageIndex }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              style={{
                width: `${carouselPages.length * 100}%`,
                height: "100%",
                touchAction: "pan-y",
                cursor: "grab",
              }}
            >
              {carouselPages.map((page, idx) => {
                if (page === "next-chapter-page") {
                  return (
                    <div
                      key="next-chapter-page"
                      className="flex-shrink-0 flex-grow-0 w-full h-full flex items-center justify-center bg-dark-bg"
                    >
                      <NextChapterButton />
                    </div>
                  );
                }

                return (
                  <div
                    key={page}
                    className="flex-shrink-0 flex-grow-0 w-full h-full flex items-center justify-center"
                  >
                    {renderImage(page, idx)}
                  </div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
