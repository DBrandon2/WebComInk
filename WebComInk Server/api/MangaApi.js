const axios = require("axios");

console.log("Test simple");

const fetchMangas = async ({
  limit = 15,
  lang = "fr",
  offset = 0,
  includes = [],
}) => {
  const params = {
    limit,
    offset,
    "contentRating[]": ["safe"],
    "availableTranslatedLanguage[]": [lang],
    ...(includes.length > 0 && {
      "includes[]": includes,
    }),
  };
  console.log("📡 [fetchMangas] Params envoyés à Mangadex :", params);

  try {
    const response = await axios.get("https://api.mangadex.org/manga", {
      params,
      headers: {
        "Cache-Control": "no-cache",
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

    const coverArt = relationships.find((rel) => rel.type === "cover_art");
    if (!coverArt) {
      console.warn(`Pas de cover trouvée pour le manga ${mangaId}`);
      return null;
    }

    const coverId = coverArt.id;

    const coverResponse = await axios.get(
      `https://api.mangadex.org/cover/${coverId}`,
      {
        headers: {
          Origin: "https://web-com-ink.vercel.app",
        },
      }
    );

    const fileName = coverResponse.data.data.attributes.fileName;
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
