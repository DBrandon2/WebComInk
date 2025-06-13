import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function getMangas(limit, lang = "fr", offset = 0, includes = []) {
  const params = new URLSearchParams({
    limit,
    offset,
    "availableTranslatedLanguage[]": lang,
  });

  includes.forEach((inc) => params.append("includes[]", inc));

  const url = `https://api.mangadex.org/manga?${params.toString()}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Erreur lors du chargement des mangas");
  return res.json();
}
export const getCoverById = async (coverId) => {
  return axios
    .get(`${API_BASE_URL}cover/${coverId}`)
    .then((res) => res.data.data.attributes.fileName)
    .catch(() => null);
};

export const getPersonById = async (id, type) => {
  try {
    const response = await axios.get(`https://api.mangadex.org/${type}/${id}`);
    return response.data.data.attributes.name;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des informations : ${type} avec l'ID ${id}: ${error.message}`
    );
    return "Inconnu";
  }
};

const personCache = new Map();
const coverCache = new Map();

export const enrichMangas = async (mangas) => {
  return Promise.all(
    mangas.map(async (manga) => {
      const relationships = manga.relationships || [];

      // Filtrer les ids des auteurs, artistes et cover
      const authorIds = relationships
        .filter((r) => r.type === "author")
        .map((r) => r.id);
      const artistIds = relationships
        .filter((r) => r.type === "artist")
        .map((r) => r.id);
      const coverRel = relationships.find((r) => r.type === "cover_art");

      // Récupérer noms auteurs
      const authors = await Promise.all(
        authorIds.map(async (id) => {
          if (personCache.has(id)) return personCache.get(id);
          const name = await getPersonById(id, "author");
          personCache.set(id, name);
          return name;
        })
      );

      // Récupérer noms artistes
      const artists = await Promise.all(
        artistIds.map(async (id) => {
          if (personCache.has(id)) return personCache.get(id);
          const name = await getPersonById(id, "artist");
          personCache.set(id, name);
          return name;
        })
      );

      // Récupérer fileName cover et construire l’URL
      let coverUrl = null;
      if (coverRel) {
        if (coverCache.has(coverRel.id)) {
          coverUrl = coverCache.get(coverRel.id);
        } else {
          const fileName = await getCoverById(coverRel.id);
          if (fileName) {
            coverUrl = `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.256.jpg`;
            coverCache.set(coverRel.id, coverUrl);
          }
        }
      }

      return {
        ...manga,
        authorName: [...new Set(authors)].join(", ") || "Inconnu",
        artistName: [...new Set(artists)].join(", ") || "Inconnu",
        coverUrl,
      };
    })
  );
};
