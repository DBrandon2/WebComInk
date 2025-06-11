const axios = require("axios");

const fetchMangas = async ({ limit = 10, lang = "fr" }) => {
  try {
    const response = await axios.get("https://api.mangadex.org/manga", {
      params: {
        limit,
        "contentRating[]": "safe",
        "translatedLanguage[]": lang,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Erreur dans fetchMangas: " + error.message);
  }
};

const fetchMangaById = async (id) => {
  try {
    const response = await axios.get(`https://api.mangadex.org/manga/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Erreur dans fetchMangaById: " + error.message);
  }
};

module.exports = {
  fetchMangas,
  fetchMangaById,
};
