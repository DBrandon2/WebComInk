import axios from "axios";

import { toApiUrl } from "../utils/api";

export async function getMangas({
  limit = 15,
  offset = 0,
  lang = "fr",
  includes = [],
  order = {},
  sort = "Popularité",
  status = null,
  includedTags = [],
  excludedTags = [],
  ids = null,
  title = null,
  year = null,
}) {
  const params = {
    limit,
    offset,
    lang,
    includes,
    sort,
  };

  if (status) {
    params.status = status;
  }

  if (ids && ids.length > 0) {
    params.ids = ids.join(",");
  }

  if (title) {
    params.title = title;
  }

  if (year) {
    params.year = Number(year);
  }

  // Ajouter les genres inclus
  if (includedTags && includedTags.length > 0) {
    params.includedTags = includedTags;
  }

  // Ajouter les genres exclus
  if (excludedTags && excludedTags.length > 0) {
    params.excludedTags = excludedTags;
  }

  // Convertir l'objet `order` en query string
  Object.entries(order).forEach(([key, value]) => {
    params[`order[${key}]`] = value;
  });

  try {
  const res = await axios.get(toApiUrl(`/manga`), { params });
    return res.data;
  } catch (error) {
    console.error('getMangas error:', error);
    throw new Error(
      error.response?.data?.message ||
        "Erreur lors de la récupération des mangas"
    );
  }
}

// Recherche stricte par titre (pour la SearchBar)
export async function getMangasByTitle({
  title,
  limit = 10,
  lang = "fr",
  includes = ["cover_art"],
}) {
  if (!title || title.length < 2) return { result: "ok", data: [] };
  try {
    const res = await axios.get(toApiUrl(`/manga/search`), {
      params: { title, limit, lang, includes },
    });
    return res.data;
  } catch (error) {
    console.error('getMangasByTitle error:', error);
    return { result: "error", data: [] };
  }
}

// Récupère tous les tags depuis l'API MangaDex via le proxy backend
export async function getAllTags() {
  try {
  const res = await axios.get(toApiUrl(`/proxy/manga/tag`));
    return res.data.data; // tableau de tags
  } catch (error) {
    console.error('getAllTags error:', error);
    throw new Error(
      error.response?.data?.message || "Erreur lors de la récupération des tags"
    );
  }
}
