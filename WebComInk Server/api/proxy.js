const express = require("express");
const axios = require("axios");
const { limit } = require("./MangaApi"); // Import de la limitation pLimit
const router = express.Router();

// Cache en mémoire pour les réponses at-home/server (clé = chapterId)
const chapterImageCache = new Map();
const CHAPTER_IMAGE_CACHE_TTL = 10 * 60 * 1000; // 10 minutes

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

router.get("/chapter/:chapterId", async (req, res) => {
  const { chapterId } = req.params;
  const url = `https://api.mangadex.org/chapter/${chapterId}`;
  console.log(`[PROXY] Requête /chapter/:chapterId → ${url}`);

  try {
    const response = await axios.get(url);
    console.log(
      `[PROXY] Succès /chapter/:chapterId - Status: ${response.status}`
    );
    res.json(response.data);
  } catch (err) {
    if (err.response) {
      console.error(
        `[PROXY] Erreur /chapter/:chapterId - Status: ${err.response.status} - Data:`,
        err.response.data
      );
      if (err.response.status === 404) {
        return res.status(404).send("Chapitre non trouvé");
      }
      if (err.response.status === 429) {
        return res.status(429).send("Trop de requêtes vers MangaDex (429)");
      }
    } else {
      console.error(
        `[PROXY] Erreur réseau ou inconnue pour /chapter/:chapterId:`,
        err.message
      );
    }
    res.status(500).send("Erreur lors de la récupération du chapitre");
  }
});

// Fonction utilitaire pour attendre un certain temps (en ms)
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Nouvelle route proxy pour les images de chapitre (at-home/server)
router.get("/chapter-image/:chapterId", async (req, res) => {
  const { chapterId } = req.params;
  const url = `https://api.mangadex.org/at-home/server/${chapterId}`;
  console.log(`[PROXY] Requête /chapter-image/:chapterId → ${url}`);

  // Vérifie le cache
  const cached = chapterImageCache.get(chapterId);
  if (cached && cached.expire > Date.now()) {
    console.log(`[PROXY] Cache hit pour chapitre ${chapterId}`);
    return res.json(cached.data);
  }

  try {
    await delay(300); // Ajoute un délai de 300ms entre chaque requête
    const response = await limit(() =>
      axios.get(url, {
        headers: {
          "User-Agent": "WebComInk/1.0 (contact.webcomink@gmail.com)",
          Origin: "https://web-com-ink.vercel.app",
          Referer: "https://web-com-ink.vercel.app",
        },
      })
    );
    console.log(
      `[PROXY] Succès /chapter-image/:chapterId - Status: ${response.status}`
    );
    // Met en cache la réponse
    chapterImageCache.set(chapterId, {
      data: response.data,
      expire: Date.now() + CHAPTER_IMAGE_CACHE_TTL,
    });
    res.json(response.data);
  } catch (err) {
    if (err.response) {
      console.error(
        `[PROXY] Erreur /chapter-image/:chapterId - Status: ${err.response.status} - Data:`,
        err.response.data
      );
      if (err.response.status === 404) {
        return res.status(404).send("Données d'image non trouvées");
      }
      if (err.response.status === 429) {
        return res.status(429).send("Trop de requêtes vers MangaDex (429)");
      }
    } else {
      console.error(
        `[PROXY] Erreur réseau ou inconnue pour /chapter-image/:chapterId:`,
        err.message
      );
    }
    res
      .status(500)
      .send("Erreur lors de la récupération des données d'image de chapitre");
  }
});

// Proxy pour la liste des chapitres (GET /proxy/chapter-list)
router.get("/chapter-list", async (req, res) => {
  const baseUrl = "https://api.mangadex.org/chapter";
  const query = req.url.split("?")[1] || "";
  const url = `${baseUrl}${query ? `?${query}` : ""}`;
  console.log(`[PROXY] Requête /chapter-list → ${url}`);
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "WebComInk/1.0 (contact.webcomink@gmail.com)",
        Origin: "https://web-com-ink.vercel.app",
        Referer: "https://web-com-ink.vercel.app",
      },
    });
    res.json(response.data);
  } catch (err) {
    if (err.response) {
      console.error(
        `[PROXY] Erreur /chapter-list - Status: ${err.response.status} - Data:`,
        err.response.data
      );
      return res.status(err.response.status).json(err.response.data);
    } else {
      console.error(
        `[PROXY] Erreur réseau ou inconnue pour /chapter-list:`,
        err.message
      );
      return res
        .status(500)
        .json({ message: "Erreur lors du proxy chapter-list" });
    }
  }
});

// Proxy pour la récupération de chapitres (GET /proxy/chapter)
router.get("/chapter", async (req, res) => {
  const baseUrl = "https://api.mangadex.org/chapter";
  const query = req.url.split("?")[1] || "";
  const url = `${baseUrl}${query ? `?${query}` : ""}`;
  console.log(`[PROXY] Requête /chapter → ${url}`);
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "WebComInk/1.0 (contact.webcomink@gmail.com)",
        Origin: "https://web-com-ink.vercel.app",
        Referer: "https://web-com-ink.vercel.app",
      },
    });
    res.json(response.data);
  } catch (err) {
    if (err.response) {
      console.error(
        `[PROXY] Erreur /chapter - Status: ${err.response.status} - Data:`,
        err.response.data
      );
      return res.status(err.response.status).json(err.response.data);
    } else {
      console.error(
        `[PROXY] Erreur réseau ou inconnue pour /chapter:`,
        err.message
      );
      return res.status(500).json({ message: "Erreur lors du proxy chapter" });
    }
  }
});

// Proxy pour les statistiques d'un manga (GET /proxy/statistics/manga/:id)
router.get("/statistics/manga/:id", async (req, res) => {
  const { id } = req.params;
  const url = `https://api.mangadex.org/statistics/manga/${id}`;
  console.log(`[PROXY] Requête /statistics/manga/:id → ${url}`);
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "WebComInk/1.0 (contact.webcomink@gmail.com)",
        Origin: "https://web-com-ink.vercel.app",
        Referer: "https://web-com-ink.vercel.app",
      },
    });
    res.json(response.data);
  } catch (err) {
    if (err.response) {
      console.error(
        `[PROXY] Erreur /statistics/manga/:id - Status: ${err.response.status} - Data:`,
        err.response.data
      );
      return res.status(err.response.status).json(err.response.data);
    } else {
      console.error(
        `[PROXY] Erreur réseau ou inconnue pour /statistics/manga/:id:`,
        err.message
      );
      return res
        .status(500)
        .json({ message: "Erreur lors du proxy statistics/manga/:id" });
    }
  }
});

// Proxy pour les tags MangaDex
router.get("/manga/tag", async (req, res) => {
  try {
    const response = await axios.get("https://api.mangadex.org/manga/tag");
    res.json(response.data);
  } catch (error) {
    console.error("Erreur proxy /manga/tag:", error.message);
    res.status(500).json({ error: "Erreur proxy MangaDex tag" });
  }
});

// Proxy pour la récupération d'un manga par ID (GET /proxy/manga/:id)
router.get("/manga/:id", async (req, res) => {
  const { id } = req.params;
  const url = `https://api.mangadex.org/manga/${id}`;
  console.log(`[PROXY] Requête /manga/:id → ${url}`);
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "WebComInk/1.0 (contact.webcomink@gmail.com)",
        Origin: "https://web-com-ink.vercel.app",
        Referer: "https://web-com-ink.vercel.app",
      },
    });
    res.json(response.data);
  } catch (err) {
    if (err.response) {
      console.error(
        `[PROXY] Erreur /manga/:id - Status: ${err.response.status} - Data:`,
        err.response.data
      );
      return res.status(err.response.status).json(err.response.data);
    } else {
      console.error(
        `[PROXY] Erreur réseau ou inconnue pour /manga/:id:`,
        err.message
      );
      return res
        .status(500)
        .json({ message: "Erreur lors du proxy manga/:id" });
    }
  }
});

module.exports = router;
