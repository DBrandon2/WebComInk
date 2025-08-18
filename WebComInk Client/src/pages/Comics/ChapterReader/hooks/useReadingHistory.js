import { useState, useEffect } from "react";
import {
  getReadingHistory,
  getLastReadChapter,
} from "../../../../apis/auth.api";

export const useReadingHistory = (mangaId) => {
  const [readingHistory, setReadingHistory] = useState([]);
  const [lastReadChapter, setLastReadChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Vérifier si l'utilisateur est connecté
  const isUserLoggedIn = () => {
    const token = localStorage.getItem("jwt_token");
    return !!token;
  };

  // Récupérer tout l'historique de lecture
  useEffect(() => {
    async function fetchReadingHistory() {
      // Ne faire l'appel que si l'utilisateur est connecté
      if (!isUserLoggedIn()) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getReadingHistory();
        setReadingHistory(response.readingHistory || []);
      } catch (err) {
        setError("Erreur lors du chargement de l'historique");
      } finally {
        setLoading(false);
      }
    }

    fetchReadingHistory();
  }, []);

  // Récupérer le dernier chapitre lu pour ce manga
  useEffect(() => {
    async function fetchLastReadChapter() {
      if (!mangaId || !isUserLoggedIn()) return;

      try {
        const response = await getLastReadChapter(mangaId);
        setLastReadChapter(response.lastReadChapter || null);
      } catch (err) {
        // Ignorer l'erreur silencieusement
      }
    }

    fetchLastReadChapter();
  }, [mangaId]);

  // Vérifier si un chapitre est lu (au moins 15% lu)
  const isChapterRead = (chapterId) => {
    const entry = readingHistory.find((entry) => entry.chapterId === chapterId);
    return entry && entry.progress >= 15;
  };

  // Obtenir le progrès d'un chapitre
  const getChapterProgress = (chapterId) => {
    const entry = readingHistory.find((entry) => entry.chapterId === chapterId);
    return entry ? entry.progress : 0;
  };

  // Obtenir le dernier chapitre lu pour ce manga
  const getLastReadChapterForManga = (mangaId) => {
    return readingHistory.find((entry) => entry.mangaId === mangaId);
  };

  return {
    readingHistory,
    lastReadChapter,
    loading,
    error,
    isChapterRead,
    getChapterProgress,
    getLastReadChapterForManga,
  };
};
