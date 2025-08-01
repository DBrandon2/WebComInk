import React from "react";
import { useParams, Link } from "react-router-dom";
import logo from "../../assets/logo/chat-mignon-baillant-somnolent-cartoon-vector-icon-illustration-concept-icone-nature-animale-isole-vecteur-premium-style-dessin-anime-plat.png";
import ChapterComments from "../../components/shared/ChapterComments";
import ReaderHeader from "./ChapterReader/components/ReaderHeader";
import SettingsModal from "./ChapterReader/components/SettingsModal";
import PagedReader from "./ChapterReader/components/PagedReader";
import WebtoonReader from "./ChapterReader/components/WebtoonReader";
import NextChapterButton from "./ChapterReader/components/NextChapterButton";
import PullToRefreshIndicator from "./ChapterReader/components/PullToRefreshIndicator";
import PerformanceIndicator from "./ChapterReader/components/PerformanceIndicator";
import ChapterTransition from "./ChapterReader/components/ChapterTransition";
import SimpleProgressBar from "./ChapterReader/components/SimpleProgressBar";
import { ChapterReaderContext } from "./ChapterReader/context/ChapterReaderContext";
import { useChapterReader } from "./ChapterReader/hooks/useChapterReader";
import { READING_MODES } from "./ChapterReader/utils/constants";

export default function ChapterReader() {
  const { mangaId, slug, chapterId } = useParams();

  // Utilisation du hook principal
  const {
    // États
    showHeader,
    setShowHeader,
    loading,
    error,
    currentPageIndex,
    isDragging,
    pullHeight,
    loadedPages,
    setLoadedPages,
    isTransitioning,
    transitionDirection,

    // Données
    chapter,
    chapterImages,
    imageLoadingStates,
    allChapters,
    currentChapterIndex,
    mangaTitle,

    // Paramètres
    readerMargin,
    setReaderMargin,
    readingMode,
    setReadingMode,

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
    settingsOpen,

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
    readingProgress,
    chapterProgress,
  } = useChapterReader(mangaId, slug, chapterId);

  // Constantes pour les gestes
  const triggerPull = 100;

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

  // Rendu principal avec transitions
  return (
    <ChapterTransition
      isTransitioning={isTransitioning}
      direction={transitionDirection}
    >
      <ChapterReaderContext.Provider
        value={{
          allChapters,
          currentChapterIndex,
          mangaId,
          slug,
          chapterImages,
          handleImageLoad,
          handleImageError,
          imageLoadingStates,
          loadedPages,
          setLoadedPages,
        }}
      >
        <div className="min-h-screen bg-dark-bg overflow-x-hidden" {...bind()}>
          <ReaderHeader
            showHeader={showHeader}
            mangaId={mangaId}
            slug={slug}
            readingMode={readingMode}
            allChapters={allChapters}
            currentChapterIndex={currentChapterIndex}
            chapterId={chapterId}
            goToNextChapter={goToNextChapter}
            goToPreviousChapter={goToPreviousChapter}
            goToChapter={goToChapter}
            onSettingsClick={handleSettingsClick}
            currentPageIndex={currentPageIndex}
            totalPages={chapterImages.length}
          />

          {/* Compteur de page mobile - sous la topbar */}
          {showHeader && (
            <div className="md:hidden fixed top-16 left-0 right-0 flex justify-center py-2 z-40">
              <div className="bg-dark-bg/80 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-medium">
                {readingMode === READING_MODES.MANGA
                  ? `Page ${chapterImages.length - currentPageIndex + 1} / ${
                      chapterImages.length + 1
                    }`
                  : `Page ${currentPageIndex + 1} / ${
                      chapterImages.length + 1
                    }`}
              </div>
            </div>
          )}

          {/* Contenu principal */}
          <div className="w-full">
            {chapterImages.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                Aucune image trouvée pour ce chapitre.
              </div>
            ) : readingMode === READING_MODES.WEBTOON ? (
              <div
                className={`w-full py-1 sm:py-3 transition-all duration-300`}
                onClick={(e) => {
                  if (
                    e.target.tagName === "BUTTON" ||
                    e.target.tagName === "A" ||
                    e.target.closest("button") ||
                    e.target.closest("a") ||
                    e.target.closest('[data-chapter-select="true"]') ||
                    isDragging || // Évite le toggle pendant le swipe
                    e.target.closest(".navigation-zone") // Évite le toggle sur les zones de navigation
                  ) {
                    return;
                  }
                  setShowHeader(!showHeader);
                }}
              >
                <WebtoonReader readerMargin={readerMargin} />
              </div>
            ) : (
              <PagedReader
                readingMode={readingMode}
                currentPageIndex={currentPageIndex}
                isDragging={isDragging}
                dragX={x}
                bindSwipe={isMobile ? bindSwipe : undefined}
                setShowHeader={setShowHeader}
                goToNextPage={goToNextPage}
                goToPreviousPage={goToPreviousPage}
                readerMargin={readerMargin}
              />
            )}
          </div>

          {/* BOUTON CHAPITRE SUIVANT - uniquement pour webtoon */}
          {readingMode === READING_MODES.WEBTOON && (
            <div className="transition-all duration-300">
              <NextChapterButton />
            </div>
          )}

          {/* Section commentaires sous le chapitre */}
          <div className="transition-all duration-300">
            <ChapterComments chapterId={chapterId} mangaId={mangaId} />
          </div>

          {/* Interface mobile pour pull-to-refresh (uniquement en mode webtoon) */}
          {isMobile && readingMode === READING_MODES.WEBTOON && (
            <PullToRefreshIndicator
              pullHeight={pullHeight}
              triggerPull={triggerPull}
            />
          )}
        </div>

        {/* Modale de paramètres (settings) */}
        {settingsOpen && (
          <SettingsModal
            isOpen={settingsOpen}
            onClose={closeSettings}
            readingMode={readingMode}
            setReadingMode={setReadingMode}
            readerMargin={readerMargin}
            setReaderMargin={setReaderMargin}
          />
        )}

        {/* Barre de progression simple */}
        <SimpleProgressBar
          currentPage={currentPageIndex + 1}
          totalPages={chapterImages.length}
          showHeader={showHeader}
          readingMode={readingMode}
        />
      </ChapterReaderContext.Provider>
    </ChapterTransition>
  );
}
