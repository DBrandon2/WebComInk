const { fetchMangas, fetchMangaById } = require("../api/MangaApi");

const orderMapping = {
  Popularité: { followedCount: "desc" },
  "Nouveaux mangas": { createdAt: "desc" },
  "A à Z": { title: "asc" },
  "Chapitres récents": { latestUploadedChapter: "desc" },
};

const getMangas = async (req, res) => {
  console.log("sort:", req.query.sort);
  try {
    const limit = parseInt(req.query.limit) || 15;
    const offset = parseInt(req.query.offset) || 0;
    const lang = req.query.lang || "fr";
    const includes = Array.isArray(req.query["includes[]"])
      ? req.query["includes[]"]
      : req.query["includes[]"]
      ? [req.query["includes[]"]]
      : [];

    const sort = req.query.sort || "Popularité";
    const order = orderMapping[sort] || {};

    const mangas = await fetchMangas({ limit, lang, offset, includes, order });
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

module.exports = {
  getMangas,
  getMangaById,
};
