const axios = require("axios");
const qs = require("qs");
const pLimit = require("p-limit").default;

const limit = pLimit(5); // 👈 Limite à 5 appels simultanés

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes TTL
const cache = new Map();

const GENRE_TAG_MAPPING = {
  Action: "391b0423-d847-456f-aff0-8b0cfc03066b",
  Aventure: "87cc87cd-a395-47af-b27a-93258283bbc6",
  Comédie: "4d32cc48-9f00-4cca-9b5a-a839f0764984",
  Drame: "b9af3a63-f058-46de-a9a0-e0c13906197a",
  Fantasy: "cdc58593-87dd-415e-bbc0-2ec27bf404cc",
  Horreur: "cdad7e68-1419-41dd-bdce-27753074a640",
  Romance: "423e2eae-a7a2-4a8b-ac03-a8351462d71d",
  "Science-Fiction": "256c8bd9-4904-4360-bf4f-508a76d67183",
  Thriller: "07251805-a27e-4d59-b488-f0bfbec15168",
  Mystère: "ee968100-4191-4968-93d3-f82d72be7e46",
  "Slice of Life": "e5301a23-ebd9-49dd-a0cb-2add944c7fe9",
  Surnaturel: "eabc5b4c-6aff-42f3-b657-3e90cbd00b75",
  Historique: "33771934-028e-4cb3-8744-691e866a923e",
  Sport: "69964a64-2f90-4d33-beeb-f3ed2875eb4c",
  Mecha: "50880a9d-5440-4732-9afb-8f457127e836",
  Ecchi: "9ab53f92-3eed-4e9b-903a-917c86035ee3",
  Yaoi: "9467335a-1b83-4497-9231-765b1a34f6d3",
  Yuri: "a3c67850-4684-404e-9b7f-c69850ee5da6",
  Josei: "25906c5d-3de5-4556-98cd-b1a3f3595a2a",
  Seinen: "a1f53773-c69a-4ce5-8cab-fffcd90b1565",
  Shoujo: "dee48675-8289-4eca-94f5-a9fdfeb7f5b8",
  Shounen: "27a532ba-8aab-4932-8515-d90268ba82de",
  Isekai: "ace04997-f6bd-436e-b261-779182193d3d",
  "Martial Arts": "799c202e-7daa-44eb-9cf7-8a3c0441531e",
};

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
  limit: limitVal = 15,
  lang = "fr",
  offset = 0,
  includes = [],
  order = {},
  status = {},
  includedTags = [],
  excludedTags = [],
  ids = [],
  title = null,
  year = null,
}) {
  console.log("MANGAAPI ORDER : ", order);

  const params = {
    limit: limitVal,
    offset,
    contentRating: ["safe"],
    availableTranslatedLanguage: [lang],
    ...(includes.length > 0 && { includes }),
    ...(Object.keys(order).length > 0 && { order }),
    ...(status ? { status: [status] } : {}),
    ...(includedTags.length > 0 && { includedTags }),
    ...(excludedTags.length > 0 && { excludedTags }),
    ...(ids && ids.length > 0 && { ids }),
  };

  const key = getCacheKey(params);
  const cached = cache.get(key);
  if (cached && cached.expire > Date.now()) {
    return cached.data;
  }

  try {
    const response = await limit(() =>
      axios.get("https://api.mangadex.org/manga", {
        params,
        paramsSerializer: (params) => qs.stringify(params, { encode: false }),
        headers: {
          "Cache-Control": "no-cache",
          "User-Agent": "WebComInk/1.0 (contact.webcomink@gmail.com)",
        },
      })
    );

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
    const response = await limit(() =>
      axios.get(`https://api.mangadex.org/manga/${id}`)
    );
    cache.set(key, { data: response.data, expire: Date.now() + CACHE_TTL });
    return response.data;
  } catch (error) {
    throw new Error("Erreur dans fetchMangaById: " + error.message);
  }
}

async function fetchTags() {
  const key = "mangadx_tags";
  const cached = cache.get(key);
  if (cached && cached.expire > Date.now()) {
    return cached.data;
  }

  try {
    const response = await limit(() =>
      axios.get("https://api.mangadex.org/manga/tag")
    );
    cache.set(key, {
      data: response.data,
      expire: Date.now() + CACHE_TTL * 12,
    });
    return response.data;
  } catch (error) {
    console.error("Erreur dans fetchTags:", error.message);
    return null;
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

    const coverResponse = await limit(() =>
      axios.get(`https://api.mangadex.org/cover/${coverId}`, {
        headers: {
          Origin: "https://web-com-ink.vercel.app",
        },
      })
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

async function fetchChapterById(id) {
  const key = `chapterById_${id}`;
  const cached = cache.get(key);
  if (cached && cached.expire > Date.now()) {
    return cached.data;
  }

  try {
    const response = await limit(() =>
      axios.get(`https://api.mangadex.org/chapter/${id}`)
    );
    const chapterData = response.data;
    cache.set(key, { data: chapterData, expire: Date.now() + CACHE_TTL });
    return chapterData;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // Chapitre non trouvé : retourne null pour que le contrôleur gère
      return null;
    }
    // Pour d'autres erreurs, relance
    throw error;
  }
}

// Recherche stricte par titre (pour la SearchBar)
async function fetchMangasByTitle({
  title,
  limit = 10,
  lang = "fr",
  includes = [],
}) {
  if (!title || title.length < 2) return { result: "ok", data: [] };
  try {
    const response = await axios.get("https://api.mangadex.org/manga", {
      params: {
        title,
        limit,
        availableTranslatedLanguage: [lang],
        includes,
        contentRating: ["safe"],
      },
      paramsSerializer: (params) => qs.stringify(params, { encode: false }),
      headers: {
        "Cache-Control": "no-cache",
        "User-Agent": "WebComInk/1.0 (contact.webcomink@gmail.com)",
      },
    });
    // On filtre côté serveur pour ne garder que les titres qui contiennent le terme recherché (fr, en, ja-ro)
    const filtered = (response.data.data || []).filter((manga) => {
      const t = manga.attributes?.title || {};
      const search = title.toLowerCase();
      return (
        (t.fr && t.fr.toLowerCase().includes(search)) ||
        (t.en && t.en.toLowerCase().includes(search)) ||
        (t["ja-ro"] && t["ja-ro"].toLowerCase().includes(search))
      );
    });
    return { result: "ok", data: filtered };
  } catch (error) {
    console.error(
      "Erreur fetchMangasByTitle:",
      error.response?.data || error.message
    );
    return { result: "error", data: [] };
  }
}

module.exports = {
  fetchMangas,
  fetchMangaById,
  fetchCoverUrlByMangaId,
  fetchTags,
  fetchChapterById,
  fetchMangasByTitle, // nouvelle fonction exportée
  limit, //ajout de l'export de limit
};
