const axios = require("axios");

const fetchMangas = async ({ limit = 20, lang = "fr", offset = 0 }) => {
  try {
    console.log("Params envoyés à Mangadex:", {
      limit,
      "contentRating[]": ["safe"],
      "translatedLanguage[]": [lang],
    });

    const response = await axios.get("https://api.mangadex.org/manga", {
      params: {
        limit,
        offset,
        "contentRating[]": ["safe"],
        "availableTranslatedLanguage[]": [lang],
        "includes[]": ["author", "artist", "cover_art"], // <-- Ajouté ic
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

const fetchCoverUrlByMangaId = async (mangaId) => {
  try {
    const mangaData = await fetchMangaById(mangaId);
    const relationships = mangaData.data.relationships;

    // Trouver le cover_art dans les relationships
    const coverArt = relationships.find((rel) => rel.type === "cover_art");
    if (!coverArt) {
      console.warn(`Pas de cover trouvée pour le manga ${mangaId}`);
      return null;
    }

    const coverId = coverArt.id;

    // Récupérer le filename de la cover
    const coverResponse = await axios.get(
      `https://api.mangadex.org/cover/${coverId}`
    );
    const fileName = coverResponse.data.data.attributes.fileName;

    // Construire l'URL finale de la cover
    const coverUrl = `https://uploads.mangadex.org/covers/${mangaId}/${fileName}`;
    return coverUrl;
  } catch (error) {
    console.error("Erreur dans fetchCoverUrlByMangaId:", error.message);
    return null;
  }
};

module.exports = {
  fetchMangas,
  fetchMangaById,
  fetchCoverUrlByMangaId,
};
