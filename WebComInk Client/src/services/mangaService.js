import axios from "axios";

const API_BASE_URL = "https://api.mangadex.org/";

export const getMangas = async (limit = 20, lang = "fr", offset = 0) => {
  return axios
    .get(`${API_BASE_URL}manga`, {
      params: {
        limit,
        offset,
        "includes[]": ["author", "artist", "cover_art"],
        "contentRating[]": ["safe"],
        "availableTranslatedLanguage[]": [lang],
      },
    })
    .then((res) => res.data);
};


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
