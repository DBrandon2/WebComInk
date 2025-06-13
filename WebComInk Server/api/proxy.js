const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/covers/:mangaId/:fileName", async (req, res) => {
  try {
    const { mangaId, fileName } = req.params;

    // Exemple : fileName = "7f27c05b-16be-4f97-b317-df6544f6d4b8.256.jpg"
    // On enlève le ".256" avant l'extension
    const originalFileName = fileName.replace(".256", "");

    // Construire l'URL MangaDex avec resize=256
    const url = `https://uploads.mangadex.org/covers/${mangaId}/${originalFileName}.256.jpg`;

    const response = await axios.get(url, {
      responseType: "stream",
      headers: {
        Origin: "https://mangadex.org",
        Referer: "https://mangadex.org",
      },
    });

    // Propager le Content-Type reçu
    res.setHeader("Content-Type", response.headers["content-type"]);

    // Streamer la réponse vers le client
    response.data.pipe(res);
  } catch (error) {
    console.error("Erreur proxy :", error.message);
    res.status(500).send("Erreur lors du proxy");
  }
});

module.exports = router;
