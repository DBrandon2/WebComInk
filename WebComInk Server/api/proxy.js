const express = require("express");
const axios = require("axios");
const router = express.Router();

async function tryFetch(url, headers) {
  try {
    const response = await axios.get(url, {
      responseType: "stream",
      headers,
    });
    return response;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return null; // fichier pas trouvé
    }
    throw err; // autre erreur, on remonte
  }
}

// Proxy modifié

router.get("/covers/:mangaId/:fileName", async (req, res) => {
  const { mangaId, fileName } = req.params;
  const headers = {
    Origin: "https://mangadex.org",
    Referer: "https://mangadex.org",
  };

  // On garde le fileName tel quel (avec .256.jpg)
  const urlWith256 = `https://uploads.mangadex.org/covers/${mangaId}/${fileName}`;

  // Et on enlève le .256.jpg à la fin pour la tentative alternative
  const fileNameWithout256 = fileName.replace(/\.256\.jpg$/, "");
  const urlWithout256 = `https://uploads.mangadex.org/covers/${mangaId}/${fileNameWithout256}`;

  try {
    // 1ère tentative
    let response = await tryFetch(urlWith256, headers);

    // 2ème tentative si 404
    if (!response) {
      response = await tryFetch(urlWithout256, headers);
    }

    if (!response) {
      return res.status(404).send("Image non trouvée sur Mangadex");
    }

    res.setHeader("Content-Type", response.headers["content-type"]);
    response.data.pipe(res);
  } catch (error) {
    console.error("Erreur proxy :", error.message, error?.response?.status);
    res.status(500).send("Erreur lors du proxy");
  }
});

module.exports = router;
