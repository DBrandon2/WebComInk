const {
  fetchMangas,
  fetchMangaById,
  fetchTags,
  fetchMangasByTitle,
} = require("../api/MangaApi");

const orderMapping = {
  Popularité: { followedCount: "desc" },
  "Nouveaux mangas": { createdAt: "desc" },
  "A à Z": { title: "asc" },
  "Z à A": { title: "desc" },
  "Chapitres récents": { latestUploadedChapter: "desc" },
  "Date de parution (récent)": { year: "desc" },
  "Date de parution (ancien)": { year: "asc" },
};

const getMangas = async (req, res) => {
  console.log("Received status:", req.query.status);

  console.log("Controller sort:", req.query.sort);
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    const lang = req.query.lang || "fr";
    const includes = Array.isArray(req.query["includes[]"])
      ? req.query["includes[]"]
      : req.query["includes[]"]
      ? [req.query["includes[]"]]
      : [];

    const sort = req.query.sort || "Popularité";
    const order = orderMapping[sort] || {};
    const status = req.query.status;
    const includedTags = Array.isArray(req.query["includedTags[]"])
      ? req.query["includedTags[]"]
      : req.query["includedTags[]"]
      ? [req.query["includedTags[]"]]
      : [];

    const excludedTags = Array.isArray(req.query["excludedTags[]"])
      ? req.query["excludedTags[]"]
      : req.query["excludedTags[]"]
      ? [req.query["excludedTags[]"]]
      : [];

    let ids = [];
    if (req.query.ids) {
      ids = req.query.ids.split(",");
    }

    const title = req.query.title;
    const year = req.query.year ? parseInt(req.query.year) : null;

    const mangas = await fetchMangas({
      limit,
      lang,
      offset,
      includes,
      order,
      status,
      includedTags,
      excludedTags,
      ids,
      title,
      year,
    });
    res.json(mangas);
  } catch (error) {
    console.error("Erreur getMangas:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des mangas" });
  }
};

const getMangaById = async (req, res) => {
  try {
    const mangaId = req.params.id;
    console.log("[getMangaById] ID reçu:", mangaId);
    const manga = await fetchMangaById(mangaId);
    if (!manga) {
      console.log("[getMangaById] Manga non trouvé pour ID:", mangaId);
      return res.status(404).json({ message: "Manga non trouvé" });
    }
    res.json(manga);
  } catch (error) {
    console.error("Erreur getMangaById:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération du manga" });
  }
};

const getTags = async (req, res) => {
  try {
    const tags = await fetchTags();
    res.json(tags);
  } catch (error) {
    console.error("Erreur getTags:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des tags" });
  }
};

const { fetchChapterById } = require("../api/MangaApi");

const getChapterById = async (req, res) => {
  try {
    const chapterId = req.params.id;
    const chapter = await fetchChapterById(chapterId);

    if (!chapter || chapter.result !== "ok" || !chapter.data) {
      return res.status(404).json({ message: "Chapitre non trouvé" });
    }

    res.json(chapter);
  } catch (error) {
    console.error("Erreur getChapterById:", error.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Contrôleur pour la recherche stricte par titre
const getMangasByTitle = async (req, res) => {
  try {
    const { title, limit, lang, includes } = req.query;
    const result = await fetchMangasByTitle({
      title,
      limit: limit ? parseInt(limit) : 10,
      lang: lang || "fr",
      includes: includes ? [].concat(includes) : ["cover_art"],
    });
    res.json(result);
  } catch (error) {
    console.error("Erreur getMangasByTitle:", error);
    res.status(500).json({ message: "Erreur lors de la recherche par titre" });
  }
};

module.exports = {
  getMangas,
  getMangaById,
  getTags,
  getChapterById,
  getMangasByTitle, // nouvelle exportation
};
