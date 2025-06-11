import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getMangas = async (limit = 10, lang = "fr") => {
  try {
    const response = await axios.get(`${API_BASE_URL}mangas`, {
      params: { limit, lang },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur getMangas:", error);
    throw error;
  }
};
