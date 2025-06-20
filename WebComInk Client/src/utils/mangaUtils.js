/**
 * Utilitaires pour le traitement des données manga
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Enrichit les données manga avec des informations formatées
 * @param {Array} mangas - Tableau des mangas bruts de l'API
 * @returns {Array} Tableau des mangas enrichis avec titre, couverture, auteur et artiste
 */
export function enrichMangas(mangas) {
  if (!Array.isArray(mangas)) {
    console.warn("enrichMangas: Expected an array, received:", typeof mangas);
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

    const coverUrl = coverFileName
      ? `${API_BASE_URL}/covers/${manga.id}/${coverFileName}.256.jpg`
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

    return {
      id: manga.id,
      title,
      coverUrl,
      authorName:
        authors.length > 0 ? [...new Set(authors)].join(", ") : "Inconnu",
      artistName:
        artists.length > 0 ? [...new Set(artists)].join(", ") : "Inconnu",
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
export function getMangaCoverUrl(manga, size = "256") {
  const relationships = manga.relationships || [];
  const coverRel = relationships.find((rel) => rel.type === "cover_art");
  const coverFileName = coverRel?.attributes?.fileName;

  return coverFileName
    ? `${API_BASE_URL}/covers/${manga.id}/${coverFileName}.${size}.jpg`
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
