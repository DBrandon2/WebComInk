const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/covers/:mangaId/:fileName", async (req, res) => {
  try {
    const { mangaId, fileName } = req.params;

    const originalFileName = fileName.replace(".256", "");

    const url = `https://uploads.mangadex.org/covers/${mangaId}/${originalFileName}.256.jpg`;

    console.log(`Proxy: ${url}`);

    const response = await axios.get(url, {
      responseType: "stream",
      headers: {
        Origin: "https://mangadex.org",
        Referer: "https://mangadex.org",
      },
    });

    res.setHeader("Content-Type", response.headers["content-type"]);
    response.data.pipe(res);
  } catch (error) {
    console.error("Erreur proxy :", error.message, error?.response?.status);
    res.status(500).send("Erreur lors du proxy");
  }
});

module.exports = router;
