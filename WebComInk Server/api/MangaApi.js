const axios = require("axios");
const qs = require("qs");

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes TTL
const cache = new Map();

function stableStringify(obj) {
  if (typeof obj !== "object" || obj === null) return JSON.stringify(obj);
  if (Array.isArray(obj)) return JSON.stringify(obj.map(stableStringify));
  const ordered = {};
  Object.keys(obj)
    .sort()
    .forEach((key) => {
      ordered[key] = obj[key];
    });
  return JSON.stringify(ordered);
}

function getCacheKey(params) {
  return stableStringify(params);
}

async function fetchMangas({
  limit = 15,
  lang = "fr",
  offset = 0,
  includes = [],
  order = {},
}) {
  console.log("order:", order);

  const params = {
    limit,
    offset,
    contentRating: ["safe"],
    availableTranslatedLanguage: [lang],
    ...(includes.length > 0 && { includes }),
    ...(Object.keys(order).length > 0 && { order }),
  };

  const key = getCacheKey(params);

  // Check cache
  const cached = cache.get(key);
  if (cached && cached.expire > Date.now()) {
    return cached.data;
  }

  try {
    console.log("➡️ Params envoyés à Mangadex:", params);

    const response = await axios.get("https://api.mangadex.org/manga", {
      params,
      paramsSerializer: (params) => qs.stringify(params, { encode: false }),
      headers: {
        "Cache-Control": "no-cache",
        "User-Agent": "WebComInk/1.0 (contact.webcomink@gmail.com)",
      },
    });

    cache.set(key, { data: response.data, expire: Date.now() + CACHE_TTL });
    return response.data;
  } catch (error) {
    console.error(
      "Erreur dans fetchMangas:",
      error.response?.data || error.message
    );
    throw new Error("Erreur dans fetchMangas: " + error.message);
  }
}

async function fetchMangaById(id) {
  const key = `mangaById_${id}`;
  const cached = cache.get(key);
  if (cached && cached.expire > Date.now()) {
    return cached.data;
  }

  try {
    const response = await axios.get(`https://api.mangadex.org/manga/${id}`);
    cache.set(key, { data: response.data, expire: Date.now() + CACHE_TTL });
    return response.data;
  } catch (error) {
    throw new Error("Erreur dans fetchMangaById: " + error.message);
  }
}

async function fetchCoverUrlByMangaId(mangaId) {
  const key = `coverUrlByMangaId_${mangaId}`;
  const cached = cache.get(key);
  if (cached && cached.expire > Date.now()) {
    return cached.data;
  }

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

    cache.set(key, { data: coverUrl, expire: Date.now() + CACHE_TTL });

    return coverUrl;
  } catch (error) {
    console.error("Erreur dans fetchCoverUrlByMangaId:", error.message);
    return null;
  }
}

module.exports = {
  fetchMangas,
  fetchMangaById,
  fetchCoverUrlByMangaId,
};
