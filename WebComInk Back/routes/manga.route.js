const {
  getMangas,
  getMangaById,
  getTags,
  getChapterById,
  getMangasByTitle, // ajout
} = require("../controllers/manga.controller");

const router = require("express").Router();

// GET - tags disponibles (doit être avant /:id)
router.get("/tags", getTags);

// GET - liste des mangas (avec query params éventuels)
router.get("/", getMangas);

router.get("/chapter/:id", getChapterById);

// GET - recherche stricte par titre
router.get("/search", getMangasByTitle);

// GET - manga spécifique par id
router.get("/:id", getMangaById);

module.exports = router;

// localhost:3000/user
