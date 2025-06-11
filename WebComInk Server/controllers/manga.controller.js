const { fetchMangas, fetchMangaById } = require("../api/MangaApi");

const getMangas = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const lang = req.query.lang || "fr";

    console.log("Params dans getMangas:", { limit, lang });

    const mangas = await fetchMangas({ limit, lang });
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
    const manga = await fetchMangaById(mangaId);
    if (!manga) {
      return res.status(404).json({ message: "Manga non trouvé" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération du manga" });
  }
};

module.exports = {
  getMangas,
  getMangaById,
};
