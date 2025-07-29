import React, { useRef, useContext } from "react";
import { motion } from "framer-motion";
import { ChapterReaderContext } from "../context/ChapterReaderContext";
import NextChapterButton from "./NextChapterButton";
import { API_BASE_URL, READING_MODES } from "../utils/constants";
import { buildProxiedImageUrl, isMobileDevice } from "../utils/readerUtils";

export default function PagedReader({
  readingMode,
  currentPageIndex,
  isDragging,
  dragX,
  bindSwipe,
  handleDrag,
  handleDragEnd,
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
          width: "auto",
          objectFit: "contain",
          cursor: "pointer",
          ...(readerMargin !== undefined
            ? {
                maxWidth: "100vw",
                width: `${100 - marginValue}%`,
                marginLeft: `${marginValue / 2}%`,
                marginRight: `${marginValue / 2}%`,
              }
            : {}),
        }}
        className="mx-auto"
        onClick={
          isMobile
            ? (e) => {
                if (isDragging) return;
                if (idx !== currentPageIndex) return;
                setShowHeader((h) => !h);
              }
            : (e) => {
                if (isDragging) return;
                if (idx !== currentPageIndex) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const width = rect.width;
                if (clickX < width / 3) {
                  goToPreviousPage();
                } else if (clickX > (2 * width) / 3) {
                  goToNextPage();
                } else {
                  setShowHeader((h) => !h);
                }
              }
        }
      />
    );
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[60vh]">
      {/* Indicateur de page */}
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 bg-dark-bg/80 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium">
        {readingMode === READING_MODES.MANGA
          ? `Page ${chapterImages.length - currentPageIndex + 1} / ${
              chapterImages.length + 1
            }`
          : `Page ${currentPageIndex + 1} / ${chapterImages.length + 1}`}
      </div>

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
              animate={{ x: -pageWidth * currentPageIndex }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
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
