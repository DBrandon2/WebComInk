/**
 * Utilitaires pour le traitement des données manga
 */

import { toApiUrl } from "./api";

/**
 * Enrichit les données manga avec des informations formatées
 * @param {Array} mangas - Tableau des mangas bruts de l'API
 * @returns {Array} Tableau des mangas enrichis avec titre, couverture, auteur et artiste
 */
export function enrichMangas(mangas) {
  if (!Array.isArray(mangas)) {
    return [];
  }

  return mangas.map((manga) => {
    // Extraction du titre avec fallback
    const title =
      manga.attributes?.title?.fr ||
      manga.attributes?.title?.en ||
      manga.attributes?.title?.ja ||
      manga.attributes?.title?.["ja-ro"] ||
      Object.values(manga.attributes?.title || {})[0] ||
      "Titre non disponible";

    const relationships = manga.relationships || [];

    // Extraction de la couverture
    const coverRel = relationships.find((rel) => rel.type === "cover_art");
    const coverFileName = coverRel?.attributes?.fileName;

    // Correction : utilise le proxy via backend (toApiUrl) et pas de double extension
    const coverUrl = coverFileName
      ? toApiUrl(`/proxy/covers/${manga.id}/${coverFileName}`)
      : "/default-cover.png";

    // Extraction des auteurs
    const authors = relationships
      .filter((rel) => rel.type === "author")
      .map((rel) => rel.attributes?.name)
      .filter(Boolean);

    // Extraction des artistes
    const artists = relationships
      .filter((rel) => rel.type === "artist")
      .map((rel) => rel.attributes?.name)
      .filter(Boolean);

    // Extraction des informations sur les chapitres
    const latestUploadedChapter =
      manga.attributes?.latestUploadedChapter || "N/A";
    const lastChapter = manga.attributes?.lastChapter || "N/A";

    // Extraction et formatage des tags
    const tags = (manga.attributes?.tags || []).map((tag) => ({
      id: tag.id,
      name: tag.attributes?.name || {},
      group: tag.attributes?.group || null,
    }));

    return {
      id: manga.id,
      title,
      coverUrl,
      authorName:
        authors.length > 0 ? [...new Set(authors)].join(", ") : "Inconnu",
      artistName:
        artists.length > 0 ? [...new Set(artists)].join(", ") : "Inconnu",
      latestUploadedChapter,
      lastChapter,
      // Alias pour compatibilité avec l'ancien code
      chapter: latestUploadedChapter,
      tags,
      // Conserver les données originales pour une utilisation future si nécessaire
      originalData: manga,
    };
  });
}

/**
 * Extrait le titre d'un manga avec fallback sur différentes langues
 * @param {Object} manga - Objet manga
 * @returns {string} Titre du manga
 */
export function extractMangaTitle(manga) {
  return (
    manga.attributes?.title?.fr ||
    manga.attributes?.title?.en ||
    manga.attributes?.title?.ja ||
    manga.attributes?.title?.["ja-ro"] ||
    Object.values(manga.attributes?.title || {})[0] ||
    "Titre non disponible"
  );
}

/**
 * Génère l'URL de couverture d'un manga
 * @param {Object} manga - Objet manga
 * @param {string} size - Taille de l'image (par défaut: "256")
 * @returns {string} URL de la couverture
 */
export function getMangaCoverUrl(manga) {
  const relationships = manga.relationships || [];
  const coverRel = relationships.find((rel) => rel.type === "cover_art");
  const coverFileName = coverRel?.attributes?.fileName;

  // Correction : utilise le proxy et pas de double extension
  return coverFileName
    ? toApiUrl(`/proxy/covers/${manga.id}/${coverFileName}`)
    : "/default-cover.png";
}

/**
 * Extrait les auteurs d'un manga
 * @param {Object} manga - Objet manga
 * @returns {Array} Tableau des noms d'auteurs
 */
export function getMangaAuthors(manga) {
  const relationships = manga.relationships || [];
  return relationships
    .filter((rel) => rel.type === "author")
    .map((rel) => rel.attributes?.name)
    .filter(Boolean);
}

/**
 * Extrait les artistes d'un manga
 * @param {Object} manga - Objet manga
 * @returns {Array} Tableau des noms d'artistes
 */
export function getMangaArtists(manga) {
  const relationships = manga.relationships || [];
  return relationships
    .filter((rel) => rel.type === "artist")
    .map((rel) => rel.attributes?.name)
    .filter(Boolean);
}

/**
 * Récupère les détails d'un chapitre par son UUID
 * @param {string} chapterId - UUID du chapitre
 * @returns {Promise<Object>} Détails du chapitre
 */
export async function getChapterDetails(chapterId) {
  if (!chapterId || chapterId === "N/A") {
    return { chapter: "N/A", volume: "N/A" };
  }

  try {
  const response = await fetch(toApiUrl(`/proxy/chapter/${chapterId}`));
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return {
      chapter: data.data?.attributes?.chapter || "N/A",
      volume: data.data?.attributes?.volume || "N/A",
      title: data.data?.attributes?.title || "",
    };
  } catch {
    return { chapter: "N/A", volume: "N/A" };
  }
}

/**
 * Enrichit les données manga avec les numéros de chapitres réels
 * @param {Array} mangas - Tableau des mangas enrichis
 * @returns {Promise<Array>} Tableau des mangas avec les numéros de chapitres
 */
export async function enrichMangasWithChapterNumbers(mangas) {
  const enrichedMangas = await Promise.all(
    mangas.map(async (manga) => {
      if (
        manga.latestUploadedChapter &&
        manga.latestUploadedChapter !== "N/A"
      ) {
        const chapterDetails = await getChapterDetails(
          manga.latestUploadedChapter
        );
        return {
          ...manga,
          chapter: chapterDetails.chapter,
          chapterNumber: chapterDetails.chapter,
          latestChapterNumber: chapterDetails.chapter,
        };
      }
      return {
        ...manga,
        chapter: "N/A",
        chapterNumber: "N/A",
        latestChapterNumber: "N/A",
      };
    })
  );
  return enrichedMangas;
}

/**
 * Extrait les informations sur les chapitres d'un manga
 * @param {Object} manga - Objet manga
 * @returns {Object} Objet contenant les informations sur les chapitres
 */
export function getMangaChapterInfo(manga) {
  return {
    latestUploadedChapter: manga.attributes?.latestUploadedChapter || "N/A",
    lastChapter: manga.attributes?.lastChapter || "N/A",
  };
}

/**
 * Filtre la description pour ne garder que le synopsis (enlève liens, Wikipedia, prix, etc.)
 * @param {string} description
 * @returns {string}
 */
export function filterSynopsis(description) {
  if (!description || typeof description !== "string") return "";
  // On coupe à la première URL ou mot-clé connu
  const stopWords = [
    "wikipedia.org",
    "http://",
    "https://",
    "www.",
    "Nomination",
    "Prix",
    "Récompense",
    "Award",
    "ANN",
    "Lien externe",
    "External link",
    "\n\n", // double saut de ligne
  ];
  let minIdx = description.length;
  for (const word of stopWords) {
    const idx = description.indexOf(word);
    if (idx !== -1 && idx < minIdx) minIdx = idx;
  }
  let synopsis = description.slice(0, minIdx).trim();
  // On enlève les liens markdown [texte](url)
  synopsis = synopsis.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1");
  // On enlève les liens HTML <a href=...>...</a>
  synopsis = synopsis.replace(/<a [^>]+>(.*?)<\/a>/gi, "$1");
  // On enlève les éventuels espaces ou sauts de ligne en trop
  synopsis = synopsis.replace(/\n{2,}/g, "\n").trim();
  return synopsis;
}

/**
 * Transforme une chaîne en slug URL-friendly
 * @param {string} str
 * @returns {string}
 */
export function slugify(str) {
  return str
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Récupère les infos d'un manga par son ID via le proxy backend
 * @param {string} mangaId - UUID du manga
 * @returns {Promise<Object>} Détails du manga
 */
export async function getMangaById(mangaId) {
  if (!mangaId) return null;
  try {
  const response = await fetch(toApiUrl(`/proxy/manga/${mangaId}`));
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  } catch {
    return null;
  }
}
