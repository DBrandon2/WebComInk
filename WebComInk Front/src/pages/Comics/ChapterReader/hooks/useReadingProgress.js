import { useEffect } from "react";

export function useReadingProgress({
  allChapters,
  currentChapterIndex,
  chapterId,
  mangaId,
  setReadingProgress,
  setChapterProgress,
}) {
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
  }, [
    allChapters.length,
    currentChapterIndex,
    chapterId,
    mangaId,
    setReadingProgress,
    setChapterProgress,
  ]);
}
