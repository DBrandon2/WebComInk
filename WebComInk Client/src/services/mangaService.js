import axios from "axios";

const API_BASE_URL = "https://api.mangadex.org/";

export const getMangas = (limit = 10, lang = "fr") => {
  return axios.get(`${API_BASE_URL}manga`, {
    params: {
      limit,
      "contentRating[]": ["safe"],
      "availableTranslatedLanguage[]": [lang],
    },
  }).then(res => res.data);
};

export const getCoverById = (coverId) => {
  return axios.get(`${API_BASE_URL}cover/${coverId}`)
    .then(res => res.data.data.attributes.fileName)
    .catch(() => null);
};