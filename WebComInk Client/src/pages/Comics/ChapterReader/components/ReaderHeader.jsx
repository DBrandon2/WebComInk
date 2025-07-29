import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaCog } from "react-icons/fa";
import { Grip } from "lucide-react";
import CustomChapterSelect from "../../../../components/shared/CustomChapterSelect";
import { READING_MODES } from "../utils/constants";

export default function ReaderHeader({
  showHeader,
  mangaId,
  slug,
  readingMode,
  allChapters,
  currentChapterIndex,
  chapterId,
  goToNextChapter,
  goToPreviousChapter,
  goToChapter,
  onSettingsClick,
}) {
  const settingsBtnRef = useRef(null);

  const handleSettingsClick = () => {
    if (settingsBtnRef.current) {
      const rect = settingsBtnRef.current.getBoundingClientRect();
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const modalOrigin = {
        x: rect.left + rect.width / 2 - centerX,
        y: rect.top + rect.height / 2 - centerY,
      };
      onSettingsClick(modalOrigin);
    } else {
      onSettingsClick({ x: 0, y: 0 });
    }
  };

  const ChapterSelectorDropdown = ({ direction = "down" }) => (
    <CustomChapterSelect
      chapters={allChapters}
      currentChapterId={chapterId}
      onSelect={goToChapter}
      direction={direction}
    />
  );

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 bg-dark-bg/25 backdrop-blur-lg shadow-lg transition-opacity duration-300 ${
        showHeader
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="w-full px-3 md:px-16 py-2 md:py-3 relative flex flex-col gap-2">
        {/* Mobile Layout */}
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

          {/* Selecteur chapitre */}
          <div className="flex items-center flex-1 min-w-0 max-w-[160px] mx-2">
            {readingMode === READING_MODES.MANGA ? (
              <>
                <button
                  onClick={goToNextChapter}
                  disabled={currentChapterIndex <= 0}
                  className="w-8 h-8 bg-accent text-dark-bg rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/80 transition shadow items-center justify-center cursor-pointer mr-2"
                  title="Chapitre suivant (←)"
                >
                  <FaArrowLeft size={18} />
                </button>
                <div className="min-w-0 flex items-center justify-center flex-1">
                  <ChapterSelectorDropdown direction="down" />
                </div>
                <button
                  onClick={goToPreviousChapter}
                  disabled={currentChapterIndex >= allChapters.length - 1}
                  className="w-8 h-8 bg-accent text-dark-bg rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/80 transition shadow items-center justify-center cursor-pointer ml-2"
                  title="Chapitre précédent (→)"
                >
                  <FaArrowRight size={18} />
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>

          {/* Bouton settings */}
          <div className="flex items-center min-w-[40px] justify-end ml-2">
            <button
              ref={settingsBtnRef}
              className="p-2 bg-white/10 backdrop-blur-xl backdrop-saturate-150 border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.25)] text-white rounded-full hover:bg-white/20 transition-colors duration-200 cursor-pointer"
              title="Options / Paramètres"
              onClick={handleSettingsClick}
            >
              <FaCog size={22} />
            </button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center w-full relative">
          {/* Bouton retour à gauche */}
          <div className="flex items-center">
            <Link
              to={`/Comics/${mangaId}/${slug}`}
              className="flex items-center gap-2 px-4 py-2 rounded text-white hover:bg-accent hover:text-dark-bg transition text-sm font-semibold"
              title="Retour au manga"
            >
              <span className="text-[20px] flex items-center">
                <Grip />
              </span>
              <span>Retour</span>
            </Link>
          </div>

          {/* Selecteur chapitre centré */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
            {readingMode === READING_MODES.MANGA ? (
              <>
                <button
                  onClick={goToNextChapter}
                  disabled={currentChapterIndex <= 0}
                  className="w-8 h-8 bg-accent text-dark-bg rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/80 transition shadow flex items-center justify-center cursor-pointer ml-2"
                  title="Chapitre suivant (→)"
                >
                  <FaArrowRight size={18} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={goToPreviousChapter}
                  disabled={currentChapterIndex >= allChapters.length - 1}
                  className="w-8 h-8 bg-accent text-dark-bg rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/80 transition shadow flex items-center justify-center cursor-pointer mr-2"
                  title="Chapitre précédent (←)"
                >
                  <FaArrowLeft size={18} />
                </button>
                <div className="min-w-0 flex items-center justify-center">
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
              </>
            )}
          </div>

          {/* Bouton settings à droite */}
          <div className="flex items-center min-w-[40px] justify-end ml-auto">
            <button
              ref={settingsBtnRef}
              className="p-3 bg-white/10 backdrop-blur-xl backdrop-saturate-150 border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.25)] text-white rounded-full hover:bg-white/20 transition-colors duration-200 cursor-pointer"
              title="Options / Paramètres"
              onClick={handleSettingsClick}
            >
              <FaCog size={22} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
