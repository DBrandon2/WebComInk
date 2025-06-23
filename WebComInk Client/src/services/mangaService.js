import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

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
    const res = await axios.get(`${API_BASE_URL}/manga`, { params });
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Erreur lors de la récupération des mangas"
    );
  }
}
