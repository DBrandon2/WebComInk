const express = require("express");
const axios = require("axios");
const app = express();

app.get("/api/proxy/covers/:mangaId/:fileName", async (req, res) => {
  try {
    const { mangaId, fileName } = req.params;
    const url = `https://uploads.mangadex.org/covers/${mangaId}/${fileName}`;

    const response = await axios.get(url, {
      responseType: "stream",
      headers: {
        Origin: PROD_URL, // Met ici ton domaine front
        Referer: PROD_URL, // Parfois utile aussi
      },
    });

    res.setHeader("Content-Type", response.headers["content-type"]);
    response.data.pipe(res);
  } catch (error) {
    res.status(500).send("Erreur lors du proxy");
  }
});

app.listen(3000, () => console.log("Proxy lancé"));
