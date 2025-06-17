
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Passage à axios

export async function getMangas({
  limit = 15,
  offset = 0,
  lang = "fr",
  includes = [],
}) {
  const params = {
    limit,
    offset,
    lang,
    includes,
  };

  try {
    const res = await axios.get(`${API_BASE_URL}/manga`, { params });
    console.log("[GET MANGAS] URL:", res.config.url);
    return res.data;
  } catch (error) {
    console.error("[GET MANGAS] Erreur:", error);
    throw new Error(
      error.response?.data?.message ||
        "Erreur lors de la récupération des mangas"
    );
  }
}

