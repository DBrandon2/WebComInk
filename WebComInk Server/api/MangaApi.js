const axios = require("axios");

const fetchMangas = async ({ limit = 10, lang = "fr" }) => {
  try {
    console.log("Params envoyés à Mangadex:", {
      limit,
      "contentRating[]": ["safe"],
      "translatedLanguage[]": [lang],
    });

    const response = await axios.get("https://api.mangadex.org/manga", {
      params: {
        limit,
        "contentRating[]": ["safe"],
        "availableTranslatedLanguage[]": [lang], // <--- ici
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Erreur dans fetchMangas:",
      error.response?.data || error.message
    );
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
