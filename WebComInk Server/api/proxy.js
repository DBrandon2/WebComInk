const express = require("express");
const axios = require("axios");
const router = express.Router(); // <-- router, pas app

const PROD_URL = process.env.PROD_URL;

console.log("PROD_URL =", PROD_URL);

router.get("/covers/:mangaId/:fileName", async (req, res) => {
  try {
    const { mangaId, fileName } = req.params;
    console.log("Requête proxy reçue pour :", mangaId, fileName);
    const url = `https://uploads.mangadex.org/covers/${mangaId}/${fileName}`;
    console.log("Proxy vers:", url);

    const response = await axios.get(url, {
      responseType: "stream",
      headers: {
        Origin: "https://mangadex.org", // ton domaine front
        Referer: "https://mangadex.org", // parfois utile
       
      },
    });
    console.log("Status réponse :", response.status);

    res.setHeader("Content-Type", response.headers["content-type"]);
    response.data.pipe(res);
  } catch (error) {
    console.error("Erreur proxy :", error.message);
    res.status(500).send("Erreur lors du proxy");
  }
});

module.exports = router; // <-- exporte le router, pas le serveur
